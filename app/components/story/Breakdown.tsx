'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const Breakdown = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=80%',
          pin: true,
          scrub: 1,
        },
      })

      // Title fades in
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
      )

      // Video scales up and fades in
      tl.fromTo(
        videoRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        '-=0.6',
      )

      // Everything exits
      tl.to(titleRef.current, { y: -30, opacity: 0, duration: 0.6 })
      tl.to(videoRef.current, { y: -20, opacity: 0, duration: 0.6 }, '<')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="breakdown"
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center gap-8 bg-black text-white overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/originsBG.jpg"
          alt="Origins background"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
      </div>

      <h2
        ref={titleRef}
        className="font-redzone text-5xl md:text-6xl font-bold text-[#D3AF37] opacity-0 z-10"
      >
        ORIGINS
      </h2>

      <div
        ref={videoRef}
        className="relative w-[90vw] max-w-4xl aspect-video opacity-0 z-10"
      >
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/qAYaC2Ti4xw?si=j3ajlRUJqc4dODHd&controls=0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  )
}

export default Breakdown
