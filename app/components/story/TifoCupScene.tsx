'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const TifoCupScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const winnersRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const thanksRef = useRef<HTMLParagraphElement>(null)
  const partnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
        },
      })

      // Badge drops in first
      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      )

      // Title drops in
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
        '-=0.2',
      )

      // Winners photo scales up
      tl.fromTo(
        winnersRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'back.out(1.2)' },
        '-=0.4',
      )

      // Caption staggered in
      tl.fromTo(
        captionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3',
      )

      tl.fromTo(
        thanksRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4',
      )

      tl.fromTo(
        partnerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3',
      )

      // Everything exits
      tl.to(badgeRef.current, { y: -20, opacity: 0, duration: 0.8 }, '+=0.5')
      tl.to(titleRef.current, { y: -40, opacity: 0, duration: 0.8 }, '<')
      tl.to(winnersRef.current, { scale: 0.9, opacity: 0, duration: 0.8 }, '<')
      tl.to(captionRef.current, { y: -20, opacity: 0, duration: 0.8 }, '<')
      tl.to(thanksRef.current, { y: -20, opacity: 0, duration: 0.8 }, '<')
      tl.to(partnerRef.current, { y: -20, opacity: 0, duration: 0.8 }, '<')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="tifocup"
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center bg-black text-white overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/story/Indoor.jpg"
          alt="Indoor field background"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
      </div>

      {/* Past Event Badge */}
      <div
        ref={badgeRef}
        className="opacity-0 z-10 mb-2 md:mb-3 px-4 py-1 border border-[#D3AF37]/60 rounded-full"
      >
        <span className="font-barlow text-xs md:text-sm uppercase tracking-widest text-[#D3AF37]">
          Past Event · 02.28.2026
        </span>
      </div>

      {/* Title */}
      <h2
        ref={titleRef}
        className="font-redzone text-center text-lg sm:text-2xl md:text-6xl font-bold text-[#D3AF37] opacity-0 z-10 tracking-wide px-6 leading-tight w-full max-w-[95vw]"
      >
        FIRST EVER TIFO CUP<br className="md:hidden" /> TOURNAMENT &amp; KIT SWAP
      </h2>

      {/* Winners photo */}
      <div
        ref={winnersRef}
        className="relative w-[340px] h-[200px] md:w-[640px] md:h-[380px] my-3 md:my-5 opacity-0 z-10 rounded-lg overflow-hidden shadow-2xl"
      >
        <Image
          src="/images/TourneyWinners.jpeg"
          alt="TIFO Cup Tournament Winners"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 340px, 640px"
        />
      </div>

      {/* Caption */}
      <div className="flex flex-col items-center gap-2 md:gap-3 z-10 max-w-2xl px-6 text-center">
        <p
          ref={captionRef}
          className="font-barlow text-sm md:text-lg text-white/90 opacity-0 leading-relaxed"
        >
          Thanks to everyone who visited us this past weekend as we ventured out of the city for the first time!
        </p>
        <p
          ref={thanksRef}
          className="font-barlow text-sm md:text-base text-white/70 opacity-0 leading-relaxed"
        >
          Special thanks to the team at{' '}
          <span className="text-[#D3AF37] font-semibold">@motionindoor</span>{' '}
          for their hospitality &amp; collaboration — the space was amazing 🙌
        </p>
      </div>

      {/* Partner callout */}
      <div
        ref={partnerRef}
        className="mt-4 md:mt-6 flex items-center gap-3 opacity-0 z-10"
      >
        <span className="font-barlow text-xs md:text-sm uppercase tracking-widest text-white/40">
          Proudly partnered with
        </span>
        <span className="font-barlow text-sm md:text-base font-bold tracking-widest text-[#D3AF37] uppercase">
          Red Bull
        </span>
      </div>
    </section>
  )
}

export default TifoCupScene
