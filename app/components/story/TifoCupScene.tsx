'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const TifoCupScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const shirtRef = useRef<HTMLDivElement>(null)
  const prizeRef = useRef<HTMLParagraphElement>(null)
  const formatRef = useRef<HTMLParagraphElement>(null)
  const addressRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

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

      // Title drops in
      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
      )

      // Shirt scales up with a slight rotate
      tl.fromTo(
        shirtRef.current,
        { opacity: 0, scale: 0.7, rotation: -5 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.4, ease: 'back.out(1.4)' },
        '-=0.4',
      )

      // Prize and format stagger in
      tl.fromTo(
        prizeRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3',
      )

      tl.fromTo(
        formatRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4',
      )

      
      tl.fromTo(
        addressRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4',
      )
      // Contact CTA fades in
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3',
      )

      // Everything exits
      tl.to(titleRef.current, { y: -40, opacity: 0, duration: 0.8 }, '+=0.5')
      tl.to(shirtRef.current, { scale: 0.9, opacity: 0, duration: 0.8 }, '<')
      tl.to(prizeRef.current, { y: -20, opacity: 0, duration: 0.8 }, '<')
      tl.to(formatRef.current, { y: -20, opacity: 0, duration: 0.8 }, '<')
      tl.to(addressRef.current, { y: -20, opacity: 0, duration: 0.8 }, '<')
      tl.to(ctaRef.current, { y: -20, opacity: 0, duration: 0.8 }, '<')
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
          src="/images/Indoor.jpg"
          alt="Indoor field background"
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
      </div>

      {/* Title */}
      <h2
        ref={titleRef}
        className="font-redzone text-center text-3xl md:text-8xl font-bold text-[#D3AF37] opacity-0 z-10 tracking-wider"
      >
        MOTIONINDOOR X TIFO CUP
      </h2>

      {/* Shirt image */}
      <div
        ref={shirtRef}
        className="relative w-80 h-60 md:w-[28rem] md:h-[32rem] my-2 md:my-6 opacity-0 z-10"
      >
        <Image
          src="/images/TourneyShirt.png"
          alt="Tifo Cup Shirt"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 256px, 320px"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col items-center gap-1 md:gap-3 z-10">
        <p
          ref={prizeRef}
          className="font-redzone text-2xl md:text-5xl font-bold text-white opacity-0 tracking-wide"
        >
          $10K PRIZE
        </p>
        <p
          ref={formatRef}
          className="font-redzone text-lg md:text-3xl font-medium text-white/80 opacity-0 tracking-widest"
        >
          5V5 TOURNAMENT
        </p>
        <p
          ref={addressRef}
          className="font-redzone text-center text-base md:text-3xl font-medium text-white/80 opacity-0 tracking-widest px-4"
        >
          7003 S Cooper St, Arlington, TX 76001
        </p>
      </div>

      {/* Contact CTA */}
      <div
        ref={ctaRef}
        className="mt-3 md:mt-8 flex flex-col items-center gap-1 md:gap-2 opacity-0 z-10"
      >
        <p className="text-sm md:text-base text-white/50 uppercase tracking-widest font-barlow">
          Register Now
        </p>
        <a
          href="tel:4695318572"
          className="font-barlow text-xl md:text-2xl font-semibold text-[#D3AF37] hover:text-white transition-colors duration-300"
        >
          469-531-8572
        </a>
      </div>
    </section>
  )
}

export default TifoCupScene
