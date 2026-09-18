// app/components/pages/landing/VideoSection.tsx
"use client";

import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Heading } from "@/app/components/typography/Heading";
import { Paragraph } from "@/app/components/typography/Paragraph";

interface VideoExample {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
}

const VIDEO_EXAMPLES: VideoExample[] = [
  {
    id: "1",
    title: "Perfect Sync Demo",
    description:
      "Watch how audio clips generated with Bulk Audio Gen sync perfectly with video scenes.",
    thumbnail: "/videos/thumb-1.jpg",
    duration: "2:30",
  },
  {
    id: "2",
    title: "10-Minute AI Video",
    description:
      "A complete 10-minute video created with 75 perfectly synced audio clips.",
    thumbnail: "/videos/thumb-2.jpg",
    duration: "10:00",
  },
  {
    id: "3",
    title: "Character Voices",
    description:
      "Multiple AI voices for different characters, all perfectly timed and synced.",
    thumbnail: "/videos/thumb-3.jpg",
    duration: "3:45",
  },
];

export const VideoSection = () => {
  const [playing, setPlaying] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {VIDEO_EXAMPLES.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          viewport={{ once: true }}
          className="h-full"
        >
          <Card className="group h-full overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
            <CardContent className="flex h-full flex-col p-4">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <button
                      onClick={() =>
                        setPlaying(playing === video.id ? null : video.id)
                      }
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white transition-all hover:scale-110 hover:bg-white/30"
                      aria-label={playing === video.id ? "Pause" : "Play"}
                    >
                      {playing === video.id ? (
                        <Pause className="h-6 w-6 fill-white" />
                      ) : (
                        <Play className="h-6 w-6 ml-0.5 fill-white" />
                      )}
                    </button>
                    <Paragraph
                      size="xs"
                      align="center"
                      className="mt-2 text-white/60"
                    >
                      {video.duration}
                    </Paragraph>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">
                  {video.duration}
                </div>

                {playing === video.id && (
                  <div className="absolute inset-0 flex items-center justify-between bg-black/50 px-4">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="rounded-full p-2 text-white hover:bg-white/20"
                      aria-label={muted ? "Unmute" : "Mute"}
                    >
                      {muted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      className="rounded-full p-2 text-white hover:bg-white/20"
                      aria-label="Fullscreen"
                    >
                      <Maximize2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-1 flex-col text-center">
                <Heading
                  as="h4"
                  size="md"
                  weight="semibold"
                  align="center"
                  className="text-slate-800"
                >
                  {video.title}
                </Heading>
                <Paragraph
                  size="sm"
                  align="center"
                  className="mt-1 text-slate-500"
                >
                  {video.description}
                </Paragraph>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};