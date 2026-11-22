"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";


const slides = [
  {
    image: "/images/banner-1.jpg",
    title: "Your neighbourhood library, online",
    text: "Find a book that someone nearby already loved, and borrow it for a week.",
  },
  {
    image: "/images/banner-2.jpg",
    title: "Add a book, share the shelf",
    text: "Know a great story? Put it on the BookNook shelf so other readers can borrow it too.",
  },
  {
    image: "/images/banner-3.jpg",
    title: "Borrow, read, return",
    text: "One click to borrow, one click to return. Your next read is always a few days away.",
  },
];

export function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      loop
      className="h-[62vh] min-h-[430px] w-full"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.title}>
          <div className="relative h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />

            <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 pb-10">
              <p className="text-xs font-semibold tracking-[0.3em] text-white/70 uppercase">
                BookNook
              </p>
              <h1 className="mt-4 max-w-xl font-heading text-4xl leading-[1.12] font-medium text-white md:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
                {slide.text}
              </p>
              <div className="mt-8">
                <Link
                  href="/books"
                  className="inline-block rounded-md bg-brand px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-dark"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
