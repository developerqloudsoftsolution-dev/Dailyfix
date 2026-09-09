import React, { useEffect } from 'react';
import FounderCardWithImage from '../components/founder/FounderCardWithImage';
import FounderCardWithoutImage from '../components/founder/FounderCardWithoutImage';

export default function SampleFounder() {
  useEffect(() => {
    document.title = 'The Face Behind Dailyfix | Rohit Jaiswal';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#F7F5EE] min-h-screen relative overflow-hidden pt-28 sm:pt-36 lg:pt-40 pb-24 sm:pb-36">
      {/* Ambient background glows matching Dailyfix light aesthetic */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-[#2D7D52]/10 via-[#4EA874]/6 to-transparent rounded-full blur-[140px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-[45%] -right-40 w-[600px] h-[600px] bg-[#2D7D52]/6 rounded-full blur-[140px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-10 -left-40 w-[500px] h-[500px] bg-[#143D28]/5 rounded-full blur-[140px] pointer-events-none"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-8 space-y-24 sm:space-y-36 lg:space-y-44 relative z-10">
        {/* SECTION 1: FOUNDER WITH IMAGE */}
        <section aria-label="Founder Profile with Image" className="space-y-10 sm:space-y-14">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/25 text-[#1B4D31] text-xs font-mono uppercase tracking-widest font-bold mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#2D7D52] animate-pulse" />
              Section 1 • With Image
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight">
              The Face Behind Dailyfix
            </h1>
          </div>

          <FounderCardWithImage />
        </section>

        {/* SECTION 2: FOUNDER WITHOUT IMAGE */}
        <section aria-label="Founder Profile with Brand Crest" className="space-y-10 sm:space-y-14">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5EE] border border-[#2D7D52]/25 text-[#1B4D31] text-xs font-mono uppercase tracking-widest font-bold mb-3 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#2D7D52]" />
              Section 2 • Without Image
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#143D28] tracking-tight">
              The Face Behind Dailyfix
            </h2>
          </div>

          <FounderCardWithoutImage />
        </section>
      </main>
    </div>
  );
}

