'use client';

import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative bg-green-800 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            Welcome to FRASaarthi
          </h1>
          <p className="text-lg md:text-xl text-green-200">
            India&apos;s first real-time FRA Atlas mapping website.
          </p>
        </div>

        {/* Image / Illustration */}
        <div className="md:w-1/2 relative h-64 md:h-auto">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'url("https://www.transparenttextures.com/patterns/subtle-carbon.png")',
            }}
          ></div>

          <Image
            src="https://placehold.co/600x400/FFFFFF/A9A9A9?text=Map+Illustration"
            alt="Map Illustration"
            fill
            className="relative object-cover rounded-lg shadow-2xl"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}
