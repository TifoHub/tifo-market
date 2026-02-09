'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

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
      className="relative h-screen flex flex-col items-center justify-center gap-6 bg-black text-white overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/merch1.jpg"
          alt="Merch background"
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
      </div>

      <h2
        ref={titleRef}
        className="font-redzone text-6xl md:text-8xl font-bold text-[#D3AF37] opacity-0 z-10 tracking-wider"
      >
        MERCH
      </h2>

      <p
        ref={taglineRef}
        className="font-barlow text-xl md:text-2xl text-white/70 tracking-widest uppercase opacity-0 z-10"
      >
        Rep the culture.
      </p>

      <a
        ref={buttonRef}
        href="/shop"
        className="mt-4 px-10 py-4 border-2 border-[#D3AF37] text-[#D3AF37] font-redzone text-xl md:text-2xl
                   tracking-widest uppercase opacity-0 z-10
                   transition-all duration-300
                   hover:bg-[#D3AF37] hover:text-black hover:shadow-[0_0_30px_rgba(211,175,55,0.4)]"
      >
        SHOP NOW
      </a>
    </section>
  )
}

export default MerchScene
