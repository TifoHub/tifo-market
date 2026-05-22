'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const COMMUNITY_IMAGE_FILES = [
  '20250921_031102414_iOS.jpg',
  '20250921_161128000_iOS.jpg',
  '20250921_171208000_iOS.jpg',
  '20250921_182802000_iOS.jpg',
  '20250921_192802000_iOS.jpg',
  '20251012_183934000_iOS.jpg',
  '20251012_211429000_iOS.jpg',
  '20251012_212820000_iOS.jpg',
  '20251012_212849371_iOS.jpg',
  '20251012_212906590_iOS.jpg',
  '20251015_223508000_iOS 1.jpg',
  '20251109_201349000_iOS 1.jpg',
  '20251109_205243000_iOS.jpg',
  '20251109_212412000_iOS.jpg',
  '20251207_205456000_iOS.jpg',
  '20260118_202323442_iOS.jpg',
  '20260118_221243696_iOS.jpg',
  '20260119_173746000_iOS.jpg',
  '20260228_184315642_iOS.jpg',
  '20260228_193912557_iOS.jpg',
  '20260228_204039148_iOS.jpg',
  '20260228_210159758_iOS.jpg',
  '20260228_233137000_iOS.jpg',
  '20260228_234222513_iOS 1.jpg',
  '20260314_152138947_iOS.jpg',
  '20260314_191326963_iOS.jpg',
  '20260314_202602934_iOS.jpg',
  '20260320_012210972_iOS.jpg',
  '20260418_000600120_iOS.jpg',
  '20260503_222529472_iOS.jpg',
  '20260503_230641619_iOS.jpg',
  '20260503_231402531_iOS.jpg',
  '20260503_235755258_iOS.jpg',
  '20260503_235805087_iOS.jpg',
  '20260509_231826027_iOS.jpg',
  '20260509_232109003_iOS.jpg',
  '20260509_233211183_iOS 1.jpg',
  '20260510_001452039_iOS.jpg',
  '20260510_004921303_iOS.jpg',
  '20260510_012748301_iOS.jpg',
  '20260516_211848056_iOS.jpg',
  '20260516_211848976_iOS.jpg',
  '20260516_211850008_iOS.jpg',
] as const

const communityImage = (filename: string) => ({
  src: `/images/community/${encodeURIComponent(filename)}`,
  alt: 'Community Event',
})

const communityImages = COMMUNITY_IMAGE_FILES.map(communityImage)
const topRowImages = communityImages.filter((_, i) => i % 2 === 0)
const bottomRowImages = communityImages.filter((_, i) => i % 2 === 1)

const CommunityScene = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLHeadingElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)
  const galleryTitleRef = useRef<HTMLHeadingElement>(null)
  const topRowRef = useRef<HTMLDivElement>(null)
  const bottomRowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: '+=600%',
          pin: true,
          scrub: 1,
        },
      })

      /* ===== Community Scene phases ===== */

      // Label fades in
      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1 },
      )

      // Label moves up out of the way
      tl.to(labelRef.current, { y: -60, opacity: 0, duration: 1 })

      // Video reveals with circle clip-path expanding from center
      tl.fromTo(
        videoRef.current,
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(100% at 50% 50%)', duration: 2, ease: 'power2.inOut' },
        '-=0.5',
      )

      // Video slides out to the left, caption slides in from the right
      tl.to(
        videoRef.current,
        { xPercent: -100, duration: 1.5, ease: 'power2.inOut' },
        '+=0.5',
      )
      tl.fromTo(
        captionRef.current,
        { opacity: 0, xPercent: 100 },
        { opacity: 1, xPercent: 0, duration: 1.5, ease: 'power2.inOut' },
        '<',
      )

      /* ===== Horizontal transition to Gallery ===== */

      // Hold the caption briefly, then slide both panels left to reveal gallery
      tl.to(
        panelsRef.current,
        { xPercent: -50, duration: 2.5, ease: 'power2.inOut' },
        '+=0.8',
      )

      // Gallery title fades in during the slide
      tl.fromTo(
        galleryTitleRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
        '<+=0.8',
      )

      /* ===== Gallery Scene phases ===== */

      // Top row scrolls left, bottom row scrolls right
      tl.fromTo(
        topRowRef.current,
        { xPercent: 0 },
        { xPercent: -40, duration: 4, ease: 'none' },
        '-=0.5',
      )
      tl.fromTo(
        bottomRowRef.current,
        { xPercent: -40 },
        { xPercent: 0, duration: 4, ease: 'none' },
        '<',
      )

      // Gallery title fades out towards the end
      tl.to(
        galleryTitleRef.current,
        { opacity: 0, scale: 1.1, duration: 1, ease: 'power2.in' },
        '-=1',
      )
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  // Duplicate images for wide strips
  const topImages = [...topRowImages, ...topRowImages, ...topRowImages]
  const bottomImages = [...bottomRowImages, ...bottomRowImages, ...bottomRowImages]

  return (
    <div id="community" ref={wrapperRef} className="relative h-screen overflow-hidden bg-black">
      <div ref={panelsRef} className="flex w-[200vw] h-full">
        {/* ---- Panel 1: Community ---- */}
        <section className="relative w-screen h-full shrink-0 flex items-center justify-center bg-black text-white overflow-hidden">
          <h2
            ref={labelRef}
            className="absolute text-[#D3AF37] font-redzone text-4xl md:text-6xl font-bold opacity-0 z-10 text-center"
          >
            THE COMMUNITY
          </h2>

          {/* Video container with clip-path reveal */}
          <div
            ref={videoRef}
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: 'circle(0% at 50% 50%)' }}
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              src="/scenesmedia/Community.mp4"
            />
          </div>

          <p
            ref={captionRef}
            className="absolute font-redzone text-4xl md:text-7xl font-bold opacity-0 z-10"
          >
            Always at home.
          </p>
        </section>

        {/* ---- Panel 2: Gallery ---- */}
        <section className="relative w-screen h-full shrink-0 flex flex-col items-center justify-center gap-4 bg-black text-white overflow-hidden py-3">
          {/* Top row of images */}
          <div className="w-full overflow-hidden shrink-0">
            <div ref={topRowRef} className="flex gap-3 w-max">
              {topImages.map((img, i) => (
                <div
                  key={i}
                  className="relative w-[45vh] h-[35vh] md:w-[50vh] md:h-[37vh] shrink-0 overflow-hidden"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="50vh"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Center title */}
          <h2
            ref={galleryTitleRef}
            className="font-redzone text-3xl md:text-8xl font-bold text-[#D3AF37] opacity-0 z-10 text-center tracking-wide shrink-0"
          >
            Football. Culture. Community.
          </h2>

          {/* Bottom row of images */}
          <div className="w-full overflow-hidden shrink-0">
            <div
              ref={bottomRowRef}
              className="flex gap-3 w-max"
              style={{ transform: 'translateX(-40%)' }}
            >
              {bottomImages.map((img, i) => (
                <div
                  key={i}
                  className="relative w-[45vh] h-[35vh] md:w-[50vh] md:h-[37vh] shrink-0 overflow-hidden"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="50vh"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CommunityScene
