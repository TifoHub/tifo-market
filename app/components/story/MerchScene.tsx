'use client'
import React from 'react'

const MerchScene = () => {
  return (
    <section
      id="merch"
      className="relative h-screen touch-pan-y bg-black text-white overflow-hidden"
    >
      {/* White render video - full section, centered, looped, clickable */}
      <a
        href="/shop"
        className="absolute inset-0 w-full h-full z-1 flex touch-pan-y items-center justify-center cursor-pointer"
      >
        <video
          src="/scenesmedia/whiterender.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-contain pointer-events-none"
        />
      </a>

      {/* MERCH - above model */}
      <div className="absolute top-16 md:top-12 left-0 right-0 flex justify-center z-10">
        <h2 className="font-redzone text-6xl md:text-8xl font-bold text-[#D3AF37] tracking-wider">
          MERCH
        </h2>
      </div>

      {/* Rep the culture + CTA - below model */}
      <div className="absolute bottom-16 md:bottom-12 left-0 right-0 flex flex-col items-center gap-2 md:gap-4 z-10">
        <p className="font-barlow text-xl md:text-2xl text-white/70 tracking-widest uppercase">
          Rep the culture.
        </p>
        <a
          href="/shop"
          className="px-10 py-4 border-2 border-[#D3AF37] text-[#D3AF37] font-redzone text-xl md:text-2xl
                     tracking-widest uppercase
                     transition-all duration-300
                     hover:bg-[#D3AF37] hover:text-black hover:shadow-[0_0_30px_rgba(211,175,55,0.4)]"
        >
          SHOP NOW
        </a>
      </div>
    </section>
  )
}

export default MerchScene
