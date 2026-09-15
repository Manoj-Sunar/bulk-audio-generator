// app/components/ui/LightboxModal.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image, { ImageProps } from "next/image";
import { X } from "lucide-react";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageProps: ImageProps;
}

export default function LightboxModal({
  isOpen,
  onClose,
  imageProps,
}: LightboxModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 top-10"
          onClick={onClose}
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
              {...imageProps}
              className="w-auto h-auto max-h-[85vh] object-contain"
              sizes="90vw"
              quality={100}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              aria-label="Close image"
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}