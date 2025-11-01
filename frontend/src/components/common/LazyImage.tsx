import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  placeholderSrc = '/placeholder-movie.jpg',
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver;
    const imgElement = imgRef.current;

    if (imgElement) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = src;
              img.onload = () => {
                setImageSrc(src);
                setIsLoading(false);
              };
              img.onerror = () => {
                setImageSrc(placeholderSrc);
                setIsLoading(false);
              };
              observer.unobserve(imgElement);
            }
          });
        },
        {
          rootMargin: '50px', // Start loading 50px before the image enters viewport
        }
      );

      observer.observe(imgElement);
    }

    return () => {
      if (observer && imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src, placeholderSrc]);

  return (
    <motion.img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoading ? 0.5 : 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}
