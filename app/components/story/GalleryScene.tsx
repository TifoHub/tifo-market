'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const topRowImages = [
  { src: '/images/Community1 (1).JPG', alt: 'Community Event' },
  { src: '/images/Community1 (2).JPG', alt: 'Community Event' },
  { src: '/images/Community1 (3).JPG', alt: 'Community Event' },
  { src: '/images/Community1 (4).jpg', alt: 'Community Event' },
  { src: '/images/Community2.jpg', alt: 'Community Event' },
]

const bottomRowImages = [
  { src: '/images/Community1 (5).jpg', alt: 'Community Event' },
  { src: '/images/Community1 (6).jpg', alt: 'Community Event' },
  { src: '/images/Community1 (7).jpg', alt: 'Community Event' },
  { src: '/images/Community3.jpg', alt: 'Community Event' }
]

const GalleryScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 1,
        },
      })

      // Title scales up and fades in
      tl.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
        0
      )

      // Top row scrolls to the left as user scrolls down
      tl.fromTo(
        topRowRef.current,
        { xPercent: 0 },
        { xPercent: -40, duration: 4, ease: 'none' },
        0
      )

      // Bottom row scrolls to the right as user scrolls down
      tl.fromTo(
        bottomRowRef.current,
        { xPercent: -40 },
        { xPercent: 0, duration: 4, ease: 'none' },
        0
      )

      // Title fades out towards the end
      tl.to(
        titleRef.current,
        { opacity: 0, scale: 1.1, duration: 1, ease: 'power2.in' },
        3
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Duplicate images to ensure there's enough to fill wide strips
  const topImages = [...topRowImages, ...topRowImages, ...topRowImages]
  const bottomImages = [...bottomRowImages, ...bottomRowImages, ...bottomRowImages]

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-between bg-black text-white overflow-hidden py-6"
    >
      {/* Top row of images */}
      <div className="w-full overflow-hidden shrink-0">
        <div
          ref={topRowRef}
          className="flex gap-4 w-max"
        >
          {topImages.map((img, i) => (
            <div
              key={i}
              className="relative w-52 h-36 md:w-72 md:h-48 shrink-0  overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 208px, 288px"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Center title */}
      <h2
        ref={titleRef}
        className="font-redzone text-3xl md:text-8xl font-bold text-[#D3AF37] opacity-0 z-10 text-center tracking-wide"
      >
       Football. Culture. Community.
      </h2>

      {/* Bottom row of images */}
      <div className="w-full overflow-hidden shrink-0">
        <div
          ref={bottomRowRef}
          className="flex gap-4 w-max"
          style={{ transform: 'translateX(-40%)' }}
        >
          {bottomImages.map((img, i) => (
            <div
              key={i}
              className="relative w-52 h-36 md:w-72 md:h-48 shrink-0  overflow-hidden"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill 
                className="object-cover"
                sizes="(max-width: 1000px) 208px, 288px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GalleryScene
