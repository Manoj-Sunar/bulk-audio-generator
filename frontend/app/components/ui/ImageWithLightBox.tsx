"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";

interface ImageWithLightboxProps extends ImageProps {
  containerClassName?: string;
}

export const ImageWithLightbox = ({
  containerClassName = "",
  className = "",
  ...props
}: ImageWithLightboxProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Thumbnail */}
      <div
        className={`relative cursor-pointer overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-inner transition-all hover:shadow-md ${containerClassName}`}
        onClick={handleOpen}
      >
        <Image
          {...props}
          className={`w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.02] ${className}`}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Hover overlay with magnify icon */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors hover:bg-black/20">
          <div className="rounded-full bg-white/80 p-2 opacity-0 transition-opacity hover:opacity-100">
            <Maximize2 size={20} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 top-10"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-h-[90vh] max-w-[90vw] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                {...props}
                className="w-auto h-auto max-h-[85vh] object-contain"
                sizes="90vw"
                quality={100}
              />
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                aria-label="Close image"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};