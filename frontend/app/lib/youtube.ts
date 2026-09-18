// app/lib/youtube.ts

/**
 * YouTube utility for extracting video metadata.
 * Uses YouTube's official oEmbed endpoint (no API key required, no quota limits).
 *
 * @see https://oembed.com/
 * @see https://www.youtube.com/oembed
 */

export interface YouTubeMetadata {
  /** Video ID (e.g., "VIfDWZnGgvU") */
  videoId: string;
  /** Video title */
  title: string;
  /** Author/channel display name */
  authorName: string;
  /** Author/channel profile URL */
  authorUrl: string;
  /** Best-quality thumbnail URL (maxresdefault, falls back to hqdefault) */
  thumbnailUrl: string;
  /** All available thumbnail URLs by quality */
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    standard: string;
    maxres: string;
  };
  /** Canonical YouTube watch URL */
  watchUrl: string;
  /** Embed URL for iframe */
  embedUrl: string;
  /** oEmbed provider name (always "YouTube") */
  providerName: string;
  /** oEmbed provider URL */
  providerUrl: string;
  /** HTML iframe embed code (from oEmbed) */
  html: string;
  /** Width of embed (from oEmbed) */
  width: number;
  /** Height of embed (from oEmbed) */
  height: number;
}

export class YouTubeError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "INVALID_URL"
      | "VIDEO_NOT_FOUND"
      | "PRIVATE_VIDEO"
      | "NETWORK_ERROR"
      | "UNKNOWN"
  ) {
    super(message);
    this.name = "YouTubeError";
  }
}

/* ------------------------------------------------------------------ */
/*                        URL PARSING                                  */
/* ------------------------------------------------------------------ */

/**
 * Extract YouTube video ID from various URL formats:
 *  - https://www.youtube.com/watch?v=VIDEO_ID
 *  - https://youtu.be/VIDEO_ID
 *  - https://www.youtube.com/embed/VIDEO_ID
 *  - https://www.youtube.com/v/VIDEO_ID
 *  - https://www.youtube.com/shorts/VIDEO_ID
 *  - https://m.youtube.com/watch?v=VIDEO_ID
 *  - https://music.youtube.com/watch?v=VIDEO_ID
 *  - Raw video ID (11 chars)
 */
export function extractVideoId(input: string): string | null {
  if (!input || typeof input !== "string") return null;

  const trimmed = input.trim();

  // Raw 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex to match all YouTube URL variants
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /music\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

/**
 * Build all thumbnail URLs for a given video ID.
 * YouTube serves predictable thumbnail URLs at fixed qualities.
 */
export function buildThumbnails(videoId: string) {
  return {
    default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    standard: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    maxres: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  };
}

/* ------------------------------------------------------------------ */
/*                        OEMBED FETCH                                 */
/* ------------------------------------------------------------------ */

interface OEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
}

/**
 * Fetch video metadata using YouTube's official oEmbed endpoint.
 * No API key required. No quota limits. Works server-side only.
 *
 * @param videoIdOrUrl - Video ID or any YouTube URL
 * @param options.signal - Optional AbortSignal for cancellation
 * @param options.timeoutMs - Request timeout (default 8000ms)
 */
export async function fetchYouTubeMetadata(
  videoIdOrUrl: string,
  options: { signal?: AbortSignal; timeoutMs?: number } = {}
): Promise<YouTubeMetadata> {
  const { signal, timeoutMs = 8000 } = options;

  const videoId = extractVideoId(videoIdOrUrl);
  if (!videoId) {
    throw new YouTubeError(
      `Invalid YouTube URL or video ID: "${videoIdOrUrl}"`,
      "INVALID_URL"
    );
  }

  const thumbnails = buildThumbnails(videoId);
  const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    watchUrl
  )}&format=json`;

  // Timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Link external abort signal
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  try {
    const res = await fetch(oembedUrl, {
      signal: controller.signal,
      headers: {
        // YouTube oEmbed works without UA, but setting one avoids edge cases
        "User-Agent":
          "Mozilla/5.0 (compatible; BulkAudioGenerator/1.0; +https://bulk-audio-generator.vercel.app)",
        Accept: "application/json",
      },
      // Cache on the server for 1 hour — metadata rarely changes
      next: { revalidate: 3600 },
    });

    if (res.status === 401 || res.status === 403) {
      throw new YouTubeError(
        "This video is private, age-restricted, or embed-disabled.",
        "PRIVATE_VIDEO"
      );
    }

    if (res.status === 404) {
      throw new YouTubeError(
        `Video not found: ${videoId}`,
        "VIDEO_NOT_FOUND"
      );
    }

    if (!res.ok) {
      throw new YouTubeError(
        `YouTube oEmbed responded with status ${res.status}`,
        "UNKNOWN"
      );
    }

    const data = (await res.json()) as OEmbedResponse;

    // Prefer oEmbed's thumbnail, but also expose all known qualities
    const primaryThumbnail =
      data.thumbnail_url?.replace(/^http:/, "https:") || thumbnails.high;

    return {
      videoId,
      title: data.title,
      authorName: data.author_name,
      authorUrl: data.author_url,
      thumbnailUrl: primaryThumbnail,
      thumbnails,
      watchUrl,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      providerName: data.provider_name,
      providerUrl: data.provider_url,
      html: data.html,
      width: data.width,
      height: data.height,
    };
  } catch (err) {
    if (err instanceof YouTubeError) throw err;

    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new YouTubeError("Request timed out or was cancelled.", "NETWORK_ERROR");
      }
      throw new YouTubeError(err.message, "NETWORK_ERROR");
    }

    throw new YouTubeError("Unknown error fetching YouTube metadata.", "UNKNOWN");
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Safe variant — returns null instead of throwing.
 * Useful for optional enrichment where a failure shouldn't break the page.
 */
export async function tryFetchYouTubeMetadata(
  videoIdOrUrl: string,
  options?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<YouTubeMetadata | null> {
  try {
    return await fetchYouTubeMetadata(videoIdOrUrl, options);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[YouTube] Failed to fetch metadata:", err);
    }
    return null;
  }
}

/**
 * Check if a thumbnail URL actually exists (returns 200, not 404).
 * YouTube returns a 120x90 placeholder for missing maxres thumbnails,
 * so we verify via HEAD request.
 */
export async function resolveBestThumbnail(videoId: string): Promise<string> {
  const thumbs = buildThumbnails(videoId);

  // Try maxres first
  try {
    const res = await fetch(thumbs.maxres, { method: "HEAD" });
    if (res.ok) return thumbs.maxres;
  } catch {
    // fall through
  }

  // Fallback to high (always exists)
  return thumbs.high;
}