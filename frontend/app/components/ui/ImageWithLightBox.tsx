// app/components/ui/ImageWithLightBox.tsx
"use client";

import { useState, lazy, Suspense } from "react";
import Image, { ImageProps } from "next/image";
import { Maximize2 } from "lucide-react";

const LightboxModal = lazy(() => import("./LightBoxModel"));

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgMjQwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iI2YxZjVmOSIvPjwvc3ZnPg==";

interface ImageWithLightboxProps extends ImageProps {
  containerClassName?: string;
}

export const ImageWithLightbox = ({
  containerClassName = "",
  className = "",
  priority = false,
  ...props
}: ImageWithLightboxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={`relative cursor-pointer overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-inner transition-all hover:shadow-md ${containerClassName}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          {...props}
          priority={priority}
          className={`w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02] ${className}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          loading={priority ? "eager" : "lazy"}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20">
          <div className="rounded-full bg-white/80 p-2 opacity-0 transition-opacity hover:opacity-100">
            <Maximize2 size={20} className="text-primary" />
          </div>
        </div>
      </div>

      {isOpen && (
        <Suspense fallback={null}>
          <LightboxModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            imageProps={props}
          />
        </Suspense>
      )}
    </>
  );
};