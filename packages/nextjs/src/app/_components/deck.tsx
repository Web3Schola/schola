"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Deck() {
  const deckImages = Array.from(
    { length: 11 },
    (_, i) => `/deck/${(i + 1).toString().padStart(2, "0")}.jpeg`,
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollLeft = slideWidth * index;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        const slideWidth = carouselRef.current.offsetWidth;
        const newSlide = Math.round(
          carouselRef.current.scrollLeft / slideWidth,
        );
        if (newSlide !== currentSlide) {
          setCurrentSlide(newSlide);
        }
      }
    };

    carouselRef.current?.addEventListener("scroll", handleScroll);
    return () =>
      carouselRef.current?.removeEventListener("scroll", handleScroll);
  }, [currentSlide]);

  return (
    <section className="container mx-auto px-4">
      <h2 className="mb-8 text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
        Pitch Deck
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
      <div className="carousel rounded-box w-full" ref={carouselRef}>
        {deckImages.map((src, index) => (
          <div key={index} className="carousel-item w-full">
            <Image
              src={src}
              alt={`Deck slide ${index + 1}`}
              width={1920}
              height={1080}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
