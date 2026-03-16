'use client'
import React, { useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MerchScene3D = dynamic(() => import('./MerchScene3D').then((m) => m.MerchScene3D), {
  ssr: false,
})

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const MerchScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const buttonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: 1,
        },
      })

      // Title fades in
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      )

      // Tagline fades in
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3',
      )

      // Button scales up
      tl.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.6)' },
        '-=0.2',
      )

      // Everything exits
      tl.to(titleRef.current, { y: -30, opacity: 0, duration: 0.6 }, '+=0.5')
      tl.to(taglineRef.current, { y: -20, opacity: 0, duration: 0.6 }, '<')
      tl.to(buttonRef.current, { scale: 0.9, opacity: 0, duration: 0.6 }, '<')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="merch"
      ref={sectionRef}
      className="relative h-screen bg-black text-white overflow-hidden"
    >
      {/* 3D Jersey model - full section, centered and rotating */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <MerchScene3D />
      </div>

      {/* MERCH - above model */}
      <div className="absolute top-8 md:top-12 left-0 right-0 flex justify-center z-10">
        <h2
          ref={titleRef}
          className="font-redzone text-6xl md:text-8xl font-bold text-[#D3AF37] opacity-0 tracking-wider"
        >
          MERCH
        </h2>
      </div>

      {/* Rep the culture + CTA - below model */}
      <div className="absolute bottom-8 md:bottom-12 left-0 right-0 flex flex-col items-center gap-4 z-10">
        <p
          ref={taglineRef}
          className="font-barlow text-xl md:text-2xl text-white/70 tracking-widest uppercase opacity-0"
        >
          Rep the culture.
        </p>
        <a
          ref={buttonRef}
          href="/shop"
          className="px-10 py-4 border-2 border-[#D3AF37] text-[#D3AF37] font-redzone text-xl md:text-2xl
                     tracking-widest uppercase opacity-0
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
