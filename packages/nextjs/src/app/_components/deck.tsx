"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

export default function Deck() {
  const deckImages = Array.from(
    { length: 11 },
    (_, i) => `/deck/${(i + 1).toString().padStart(2, "0")}.jpeg`,
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    slideRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
    });
  };

  const setSlideRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      slideRefs.current[index] = el;
    },
    [],
  );

  useEffect(() => {
    const options = {
      root: carouselRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const slideIndex = slideRefs.current.findIndex(
            (ref) => ref === entry.target,
          );
          if (slideIndex !== -1 && slideIndex !== currentSlide) {
            setCurrentSlide(slideIndex);
          }
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    slideRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [currentSlide]);

  return (
    <section className="container mx-auto px-4">
      <h2 className="m-10 text-3xl md:text-5xl font-bold tracking-tighter leading-tight">
        Check out our latest deck:
      </h2>
      <div className="flex justify-center mt-4">
        <div className="join">
          {deckImages.map((_, index) => (
            <button
              key={index}
              className={`join-item btn ${currentSlide === index ? "btn-active" : ""}`}
              onClick={() => handleSlideChange(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div
        className="mockup-window bg-base-300 border p-5 max-w-[960px] mx-auto"
        style={{ aspectRatio: "16/9" }}
      >
        <div className="carousel rounded-box w-full" ref={carouselRef}>
          {deckImages.map((src, index) => (
            <div
              key={index}
              className="carousel-item w-full"
              ref={(el) => setSlideRef(el, index)}
            >
              <Image
                src={src}
                alt={`Deck slide ${index + 1}`}
                width={1920}
                height={1080}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
