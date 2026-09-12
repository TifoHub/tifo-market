'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Add your jersey images here — as many as you want
const jerseyImages = [
  { src: '/images/story/SingleJersey.jpg', alt: 'Single Jersey' },
  { src: '/images/story/Jerseys.jpg', alt: 'Jerseys' },
  { src: '/images/story/Memorbila.jpg', alt: 'Memorabilia' },
  { src: '/images/story/Rack.jpg', alt: 'Jersey Rack' },
  { src: '/images/story/Cleats.jpg', alt: 'Cleats' },
  { src: '/images/story/BackPack.jpg', alt: 'Backpack' },
  { src: '/images/story/Clash.jpg', alt: 'Clash' },
  { src: '/images/story/Cups.jpg', alt: 'Cups' },
  { src: '/images/story/Poster.jpg', alt: 'Poster' },
  { src: '/images/story/Rack2.jpg', alt: 'Jersey Rack' },
]

const CollectionScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInnerRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // Infinite marquee loop (runs independently, not tied to scroll)
      const marqueeInner = marqueeInnerRef.current
      if (marqueeInner) {
        const totalWidth = marqueeInner.scrollWidth / 2 // half because we duplicated the items

        gsap.to(marqueeInner, {
          x: -totalWidth,
          duration: 40, // speed — lower = faster
          ease: 'none',
          repeat: -1, // infinite loop
        })
      }

      // Scroll-driven timeline for fade in/out
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
        },
      })

      // Heading fades in
      tl.fromTo(headingRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1 },
      )

      // Marquee fades in
      tl.fromTo(marqueeRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
        '-=0.5'
      )

      // Tagline fades in
      tl.fromTo(taglineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
      )

      // Everything exits
      tl.to(headingRef.current, { y: -40, opacity: 0, duration: 1 })
      tl.to(marqueeRef.current, { y: -30, opacity: 0, duration: 1 }, '<')
      tl.to(taglineRef.current, { y: -20, opacity: 0, duration: 1 }, '<')

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Duplicate images so the marquee can loop seamlessly
  const allImages = [...jerseyImages, ...jerseyImages]

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-center gap-10 md:gap-14 bg-black text-white overflow-hidden"
    >
      {/* Section heading */}
      <h2
        ref={headingRef}
        className="font-redzone text-4xl md:text-6xl font-bold opacity-0 z-10 text-[#D3AF37] text-center px-6"
      >
        THE COLLECTION
      </h2>

      {/* Infinite looping marquee */}
      <div
        ref={marqueeRef}
        className="w-full overflow-hidden opacity-0 z-10"
      >
        <div
          ref={marqueeInnerRef}
          className="flex gap-6 w-max"
        >
          {allImages.map((img, i) => (
            <div
              key={i}
              className="relative w-60 h-80
               md:w-64 md:h-80 shrink-0"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover "
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <p
        ref={taglineRef}
        className="font-redzone text-2xl md:text-3xl font-light tracking-widest text-white/80 opacity-0 z-10 text-center px-6"
      >
        CURATED. AUTHENTIC. TIMELESS.
      </p>
    </section>
  )
}

export default CollectionScene
