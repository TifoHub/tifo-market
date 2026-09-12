'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Image from 'next/image'
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
}

const IntroScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const p1Ref = useRef<HTMLParagraphElement>(null)
  const p2Ref = useRef<HTMLParagraphElement>(null)
  const p3Ref = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
    const ctx = gsap.context(() => {
      // Immediate fade in for title + background (plays once on load)
      gsap.fromTo(bgRef.current,
        { opacity: 0, scale: 1.15 },
        { opacity: 1, scale: 1, duration: 2, ease: 'power2.out', delay: 0.3 },
      )
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.5 },
      )

      // Scroll-driven timeline for paragraphs and exit
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 1,
          onLeave: () => {
            gsap.set(titleRef.current, { opacity: 0, y: -60 })
            gsap.set(bgRef.current, { opacity: 0 })
          },
          onEnterBack: () => {
            gsap.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
            gsap.to(bgRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
          },
        },
      })

      // Paragraphs fade in one by one on scroll
      tl.fromTo(p1Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
      )

      tl.fromTo(p2Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
      )

      tl.fromTo(p3Ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
      )

      tl.fromTo(ctaRef.current,
        { opacity: 0, y: 24, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)' },
      )

      // Paragraphs + CTA exit
      tl.to(p1Ref.current, { y: -30, opacity: 0, duration: 1 }, '+=0.4')
      tl.to(p2Ref.current, { y: -30, opacity: 0, duration: 1 }, '<')
      tl.to(p3Ref.current, { y: -30, opacity: 0, duration: 1 }, '<')
      tl.to(ctaRef.current, { y: -20, opacity: 0, duration: 1 }, '<')

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const goToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.querySelector('#contact')
    if (!el) return
    const pinSpacer = el.closest('.pin-spacer') || el
    gsap.to(window, {
      duration: 1.4,
      scrollTo: { y: pinSpacer, offsetY: 0 },
      ease: 'power2.inOut',
    })
  }

  return (
    <section
      id="intro"
      ref={sectionRef}
      className="relative h-screen flex flex-col items-center justify-start pt-10 bg-black text-white overflow-hidden"
    >
        <div className='m-5 opacity-0 z-10' ref={titleRef}>

      <h1
        
        className="text-4xl md:text-8xl text-[#D3AF37] font-bold  font-redzone "
      >
        DALLAS TIFO MARKET
      </h1>
        </div>
      <div className='m-2 absolute top-35 left-0 px-5 max-w-2xl z-10'>
      <p ref={p1Ref}
        className="mt-6 text-lg md:text-2xl text-white/90 max-w-[60vw] opacity-0"
      >
Stemming from the need to establish a proper football community in Dallas comes the Dallas TIFO Market, 
a space where fellow football lovers can 
come socialize and share their love for the beautiful game through the exchange of memorabilia.
      </p>
      <p ref={p2Ref} className="mt-6 text-lg md:text-2xl text-white/90 max-w-[60vw] opacity-0">
      Although kits are our specialty, we invite all types of football collectors
       to join the community as we are all intertwined by one common passion, football.
      </p>
      <p ref={p3Ref} className="mt-6 text-lg md:text-2xl text-white/90 max-w-[60vw] opacity-0">
      This is the Dallas TIFO Market,
always at home.
      </p>
      <a
        ref={ctaRef}
        href="#contact"
        onClick={goToContact}
        className="inline-block mt-8 px-8 py-3 border-2 border-[#D3AF37] text-[#D3AF37] font-redzone text-base md:text-xl
                   tracking-widest uppercase opacity-0
                   transition-colors duration-300
                   hover:bg-[#D3AF37] hover:text-black hover:shadow-[0_0_30px_rgba(211,175,55,0.4)]"
      >
        Contact
      </a>
      </div>
      <div ref={bgRef} className="absolute inset-0 w-full h-full opacity-0">
        <Image
          src="/HeroBG.jpg"
          alt="Hero Background"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>
    </section>
  )
}

export default IntroScene
