'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

const navLinks = [
  { label: 'Home', target: '#intro' },
  { label: 'Origins', target: '#breakdown' },
  { label: 'Collection', target: '#collection' },
  { label: 'Tifo Cup', target: '#tifocup' },
  { label: 'Community', target: '#community' },
  { label: 'Merch', target: '#merch' },
  { label: 'Socials', target: '#sponsors' },
]

const Navbar = () => {
  const [active, setActive] = useState('#intro')
  const [menuOpen, setMenuOpen] = useState(false)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const overlayRef = useRef<HTMLDivElement>(null)
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([])

  // Animate the sliding indicator to the active link (desktop only)
  const moveIndicator = useCallback((target: string) => {
    const linkEl = linkRefs.current.get(target)
    const indicator = indicatorRef.current
    if (!linkEl || !indicator) return

    const linkRect = linkEl.getBoundingClientRect()
    const parentRect = linkEl.closest('ul')!.getBoundingClientRect()

    gsap.to(indicator, {
      x: linkRect.left - parentRect.left,
      width: linkRect.width,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [])

  // Move indicator whenever active changes
  useEffect(() => {
    moveIndicator(active)
  }, [active, moveIndicator])

  // Reposition on resize
  useEffect(() => {
    const handleResize = () => moveIndicator(active)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [active, moveIndicator])

  // Track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      for (const link of [...navLinks].reverse()) {
        const el = document.querySelector(link.target)
        if (el) {
          const spacer = el.closest('.pin-spacer') || el
          const rect = spacer.getBoundingClientRect()
          if (rect.top <= window.innerHeight / 2) {
            setActive(link.target)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animate mobile menu open/close
  useEffect(() => {
    if (!overlayRef.current) return

    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      gsap.to(overlayRef.current, {
        clipPath: 'circle(150% at calc(100% - 36px) 28px)',
        duration: 0.6,
        ease: 'power3.inOut',
      })
      // Stagger in menu items
      gsap.fromTo(
        menuItemsRef.current.filter(Boolean),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, delay: 0.25, ease: 'power2.out' },
      )
    } else {
      document.body.style.overflow = ''
      gsap.to(overlayRef.current, {
        clipPath: 'circle(0% at calc(100% - 36px) 28px)',
        duration: 0.45,
        ease: 'power3.inOut',
      })
    }
  }, [menuOpen])

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(target)
    if (!el) return

    const pinSpacer = el.closest('.pin-spacer') || el

    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: pinSpacer, offsetY: 0 },
      ease: 'power2.inOut',
    })
  }, [])

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Desktop Nav Links */}
          <ul className="relative hidden md:flex items-center gap-8">
            {/* Sliding indicator bar */}
            <span
              ref={indicatorRef}
              className="absolute -bottom-1 h-[2px] bg-[#D3AF37] rounded-full opacity-0"
              style={{ willChange: 'transform, width' }}
            />

            {navLinks.map((link) => (
              <li key={link.target}>
                <a
                  ref={(el) => {
                    if (el) linkRefs.current.set(link.target, el)
                  }}
                  href={link.target}
                  onClick={(e) => handleClick(e, link.target)}
                  className={`relative text-sm md:text-base font-barlow font-medium tracking-widest uppercase transition-colors duration-300 ${
                    active === link.target
                      ? 'text-[#D3AF37]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative z-60 flex flex-col items-center justify-center w-10 h-10 gap-[5px] ml-auto"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[2px] bg-[#D3AF37] transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-[7px]' : ''
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-[#D3AF37] transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-[2px] bg-[#D3AF37] transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-55 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 md:hidden"
        style={{ clipPath: 'circle(0% at calc(100% - 36px) 28px)' }}
      >
        {navLinks.map((link, i) => (
          <a
            key={link.target}
            ref={(el) => { menuItemsRef.current[i] = el }}
            href={link.target}
            onClick={(e) => handleClick(e, link.target)}
            className={`font-redzone text-3xl tracking-widest uppercase opacity-0 transition-colors duration-300 ${
              active === link.target
                ? 'text-[#D3AF37]'
                : 'text-white/70'
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}

export default Navbar
