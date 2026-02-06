'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const socialLinks = [
  { label: 'Instagram', href: '#', icon: 'IG' },
  { label: 'X / Twitter', href: '#', icon: 'X' },
  { label: 'TikTok', href: '#', icon: 'TK' },
]

const sponsorSlots = ['Sponsor', 'Sponsor', 'Sponsor', 'Sponsor']

const SponsorsScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sponsorsRef = useRef<HTMLDivElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const copyrightRef = useRef<HTMLParagraphElement>(null)
  const devRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // Simple fade-in on scroll (no pin)
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      gsap.fromTo(
        sponsorsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      gsap.fromTo(
        socialsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      gsap.fromTo(
        copyrightRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay: 0.45,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
      gsap.fromTo(
        devRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          delay: 0.45,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="relative bg-black text-white py-20 px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-12">
        {/* Partners heading */}
        <h2
          ref={headingRef}
          className="font-redzone text-4xl md:text-5xl font-bold text-[#D3AF37] tracking-wider opacity-0"
        >
          PARTNERS
        </h2>

        {/* Sponsor placeholder slots */}
        <div
          ref={sponsorsRef}
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-0"
        >
          {sponsorSlots.map((label, i) => (
            <div
              key={i}
              className="w-32 h-20 md:w-40 md:h-24 border border-white/20 flex items-center justify-center text-white/30 font-barlow text-sm uppercase tracking-widest"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-16 h-px bg-white/20" />

        {/* Social links */}
        <div
          ref={socialsRef}
          className="flex items-center gap-8 opacity-0"
        >
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="w-12 h-12 border border-white/30 flex items-center justify-center
                         font-barlow text-sm font-semibold text-white/60
                         transition-all duration-300
                         hover:border-[#D3AF37] hover:text-[#D3AF37] hover:shadow-[0_0_15px_rgba(211,175,55,0.25)]"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p
          ref={copyrightRef}
          className="text-xs text-white/30 font-barlow tracking-widest uppercase opacity-0"
        >
          &copy; {new Date().getFullYear()} Dallas Tifo Market
        </p>
        <p
          ref={devRef}
          className="text-[10px] text-white/30 font-barlow tracking-widest uppercase opacity-0"
        >
         Website by: <a href='https://www.osworld.dev/' target='_blank' rel='noopener noreferrer' className='text-green-400'>Os World</a>
        </p>
      </div>
    </section>
  )
}

export default SponsorsScene
