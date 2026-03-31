'use client'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Instagram } from 'lucide-react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/tifo.mrkt/',
    icon: <Instagram size={20} />,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@tifo.mrkt',
    icon: <TikTokIcon className="w-5 h-5" />,
  },
]

const SponsorsScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const copyrightRef = useRef<HTMLParagraphElement>(null)
  const devRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      // Set initial state via GSAP so content is never stuck invisible if the trigger misfires
      gsap.set([socialsRef.current, copyrightRef.current, devRef.current], { opacity: 0, y: 20 })

      const shared = {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse' as const,
          invalidateOnRefresh: true,
        },
      }

      gsap.to(socialsRef.current, { opacity: 1, y: 0, duration: 0.8, ...shared })
      gsap.to(copyrightRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ...shared })
      gsap.to(devRef.current, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ...shared })

      // Recalculate after pinned sections above have set up their spacers
      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="sponsors"
      ref={sectionRef}
      className="relative bg-black text-white py-20 px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
        {/* Social links */}
        <div
          ref={socialsRef}
          className="flex items-center gap-8"
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

        <p
          ref={copyrightRef}
          className="text-xs text-white/30 font-barlow tracking-widest uppercase"
        >
          &copy; {new Date().getFullYear()} Dallas Tifo Market
        </p>
        <p
          ref={devRef}
          className="text-[10px] text-white/30 font-barlow tracking-widest uppercase"
        >
          Website by: <a href='https://www.osworld.dev/' target='_blank' rel='noopener noreferrer' className='text-green-400'>Os World</a>
        </p>
      </div>
    </section>
  )
}

export default SponsorsScene
