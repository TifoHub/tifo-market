'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { events, type TifoEvent } from '@/app/lib/events'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 72 : -72,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -72 : 72,
    opacity: 0,
  }),
}

const withHandles = (text: string) =>
  text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith('@') ? (
      <span key={i} className="text-[#D3AF37] font-semibold">
        {part}
      </span>
    ) : (
      part
    ),
  )

const EventMedia = ({ event }: { event: TifoEvent }) => {
  if (event.media.type === 'youtube') {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl bg-black">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${event.media.videoId}?rel=0`}
          title={event.media.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
      <Image
        src={event.media.src}
        alt={event.media.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 90vw, 50vw"
      />
    </div>
  )
}

const EventsScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0])

  const event = events[index]
  const count = events.length

  const paginate = useCallback(
    (dir: number) => {
      setSlide(([i]) => {
        const next = (i + dir + count) % count
        return [next, dir]
      })
    },
    [count],
  )

  const goTo = useCallback(
    (nextIndex: number) => {
      setSlide(([i]) => {
        if (nextIndex === i) return [i, 0]
        return [nextIndex, nextIndex > i ? 1 : -1]
      })
    },
    [],
  )

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3
      if (!inView) return
      e.preventDefault()
      paginate(e.key === 'ArrowRight' ? 1 : -1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [paginate])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return
    if ((e.target as HTMLElement).closest('iframe, button, a')) return
    touchStartX.current = e.clientX
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (touchStartX.current === null) return
    const delta = e.clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < 50) return
    paginate(delta < 0 ? 1 : -1)
  }

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-start md:justify-center bg-black text-white overflow-x-hidden pt-24 pb-12 md:py-16"
    >
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/story/Indoor.jpg"
          alt=""
          fill
          className="object-cover opacity-20"
          sizes="100vw"
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center opacity-0"
      >
        <h2 className="font-redzone text-4xl md:text-6xl font-bold text-[#D3AF37] tracking-wide mb-8 md:mb-12">
          EVENTS
        </h2>

        <div
          className="relative w-full min-h-[280px] md:min-h-[320px] overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={event.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <EventMedia event={event} />

              <div className="flex flex-col items-start text-left">
                <div className="mb-3 px-4 py-1 border border-[#D3AF37]/60 rounded-full">
                  <span className="font-barlow text-xs md:text-sm uppercase tracking-widest text-[#D3AF37]">
                    {event.badge} · {event.date}
                  </span>
                </div>

                <h3 className="font-redzone text-lg sm:text-xl md:text-3xl font-bold text-[#D3AF37] tracking-wide leading-tight mb-4">
                  {event.title}
                </h3>

                <p className="font-barlow text-sm md:text-lg text-white/90 leading-relaxed">
                  {event.description}
                </p>

                {event.thanks && (
                  <p className="font-barlow text-sm md:text-base text-white/70 leading-relaxed mt-3">
                    {withHandles(event.thanks)}
                  </p>
                )}

                {event.partner && (
                  <div className="mt-5 flex items-center gap-3">
                    <span className="font-barlow text-xs md:text-sm uppercase tracking-widest text-white/40">
                      Proudly partnered with
                    </span>
                    <span className="font-barlow text-sm md:text-base font-bold tracking-widest text-[#D3AF37] uppercase">
                      {event.partner}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 md:mt-10 flex items-center gap-5">
          <button
            type="button"
            onClick={() => paginate(-1)}
            aria-label="Previous event"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-[#D3AF37]/50 text-[#D3AF37] hover:bg-[#D3AF37]/15 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Events">
            {events.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${item.title}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-[#D3AF37]' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => paginate(1)}
            aria-label="Next event"
            className="flex items-center justify-center w-10 h-10 rounded-full border border-[#D3AF37]/50 text-[#D3AF37] hover:bg-[#D3AF37]/15 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default EventsScene
