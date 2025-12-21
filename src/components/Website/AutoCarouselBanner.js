'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';

// --- CONFIGURATION ---
const SLIDE_INTERVAL = 5000; // 5 seconds
const IMAGE_ASPECT_RATIO = 1.6; // Example: 16:10 for a modern look

const AutoCarouselBanner = ({ images, height = 400, containerWidthClass = 'w-[95%] md:w-[65%] max-w-7xl mx-auto' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Auto-Scroll Effect ---
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return null;

  // --- Manual Navigation ---
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // --- Next.js Image Dimension Hints (Optimization) ---
  const imageDimensionHints = useMemo(() => {
    return {
      // We use the fixed 'height' prop as a reference for optimization hints
      widthHint: height * IMAGE_ASPECT_RATIO,
      heightHint: height,
    };
  }, [height]);


  return (
    // 1. Main container: 95% width, centered, and fixed height.
    <div
      className={`relative mx-auto rounded-xl shadow-2xl overflow-hidden ${containerWidthClass}`}
    // style={{
    //   height: `${height}px`,
    // }}
    >
      <div
        className="relative w-full overflow-hidden h-[200px] md:h-[500px]" // Responsive height: 200px mobile, 500px desktop (md+)
        style={{
          perspective: '1000px' // Enables 3D space for depth effect
        }}
      >
        {/* 2. Main slides container: Moves horizontally */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((src, index) => {
            const isCurrent = index === currentIndex;
            return (
              <div
                key={index}
                className="relative min-w-full h-full flex justify-center items-center"
              >
                {/* Image Wrapper for the "Fancy" Pop/Scale Effect:
                - h-full (100%) to use max vertical space.
                - w-[98%] to maximize horizontal space.
              */}
                <div
                  // CHANGED: Use w-full (100%) to remove the 1% margin on each side.
                  className={`relative w-full h-full flex justify-center items-center transition-all duration-700 ease-in-out ${isCurrent ? 'scale-[1.03] shadow-2xl' : 'scale-[1] shadow-xl'
                    }`}
                >
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    // Optimization hints for Next.js
                    width={imageDimensionHints.widthHint}
                    height={imageDimensionHints.heightHint}
                    // CRITICAL CHANGE: Use object-contain to prevent cropping (truncation).
                    // The image will be fully visible, adding padding/white space if aspect ratio changes.
                    className="rounded-lg object-cover w-full h-full"
                    priority={index === 0}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Navigation Indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 space-x-3 p-2 bg-black/30 rounded-full backdrop-blur-sm">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 ease-in-out focus:outline-none ${index === currentIndex
                ? 'w-12 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-sm shadow-lg'
                : 'w-2 h-2 bg-white/60 rounded-full shadow-md hover:bg-white/90'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoCarouselBanner;