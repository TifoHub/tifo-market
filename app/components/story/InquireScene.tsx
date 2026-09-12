'use client'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { inquiryTypes, formatPhone, isCompletePhone } from '@/app/lib/inquiries'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const fieldClass =
  'w-full bg-white/5 border border-white/15 px-4 py-3 font-barlow text-sm md:text-base text-white placeholder:text-white/30 outline-none rounded-none focus:border-[#D3AF37] transition-colors'

const InquireScene = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const form = e.currentTarget
    const data = new FormData(form)

    if (phone && !isCompletePhone(phone)) {
      setError('Please enter a 10-digit phone number, like (555) 000-0000.')
      setSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') || '').trim(),
          email: String(data.get('email') || '').trim(),
          phone,
          company: String(data.get('company') || '').trim(),
          inquiryType: String(data.get('inquiryType') || '').trim(),
          message: String(data.get('message') || '').trim(),
        }),
      })
      const result = await response.json().catch(() => ({ ok: false }))

      if (!response.ok || !result.ok) {
        setError(result.error || 'Unable to send your inquiry right now.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Unable to send your inquiry right now.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="inquire"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-black text-white overflow-x-hidden pt-24 pb-16 px-6"
    >
      <div
        ref={contentRef}
        className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start opacity-0"
      >
        <div className="flex flex-col items-start text-left md:pt-4">
          <h2 className="font-redzone text-4xl md:text-6xl font-bold text-[#D3AF37] tracking-wide mb-6">
            INQUIRE
          </h2>
          <p className="font-barlow text-sm md:text-lg text-white/90 leading-relaxed mb-4">
            Looking to sponsor a drop, collab on a kit swap, or just get in the room?
          </p>
          <p className="font-barlow text-sm md:text-base text-white/60 leading-relaxed">
            Partnerships, press, events, or anything we haven&apos;t thought of yet, tell us what you&apos;re working on and we&apos;ll get back to you.
          </p>
        </div>

        {submitted ? (
          <div className="border border-[#D3AF37]/40 bg-white/5 p-8 md:p-10 min-h-[420px] flex flex-col justify-center">
            <span className="font-barlow text-xs uppercase tracking-widest text-[#D3AF37] mb-4">
              Inquiry received
            </span>
            <h3 className="font-redzone text-2xl md:text-3xl text-[#D3AF37] mb-4">
              We got it.
            </h3>
            <p className="font-barlow text-sm md:text-base text-white/80 leading-relaxed">
              Thanks for reaching out. We&apos;ll read it over and get back to you.
            </p>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-2 block font-barlow text-xs uppercase tracking-widest text-white/50">
                Name
              </label>
              <input id="name" name="name" type="text" required className={fieldClass} placeholder="Your name" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="email" className="mb-2 block font-barlow text-xs uppercase tracking-widest text-white/50">
                  Email
                </label>
                <input id="email" name="email" type="email" required className={fieldClass} placeholder="you@brand.com" />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 flex items-center gap-2 font-barlow text-xs uppercase tracking-widest text-white/50">
                  Phone
                  <span className="text-white/30 normal-case tracking-normal">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={14}
                  title="Use a 10-digit number, like (555) 000-0000"
                  value={phone}
                  onChange={(event) => setPhone(formatPhone(event.target.value))}
                  className={fieldClass}
                  placeholder="(555) 000-0000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="mb-2 flex items-center gap-2 font-barlow text-xs uppercase tracking-widest text-white/50">
                Company / Brand
                <span className="text-white/30 normal-case tracking-normal">(optional)</span>
              </label>
              <input id="company" name="company" type="text" className={fieldClass} placeholder="Who you represent" />
            </div>

            <div>
              <label htmlFor="inquiryType" className="mb-2 block font-barlow text-xs uppercase tracking-widest text-white/50">
                I&apos;m reaching out about
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                required
                defaultValue=""
                className={`${fieldClass} cursor-pointer bg-black [&>option]:bg-white [&>option]:text-black`}
              >
                <option value="" disabled className="bg-white text-black">
                  Select one
                </option>
                {inquiryTypes.map((type) => (
                  <option key={type} value={type} className="bg-white text-black">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block font-barlow text-xs uppercase tracking-widest text-white/50">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className={`${fieldClass} resize-none`}
                placeholder="Tell us what you have in mind..."
              />
            </div>

            {error ? <p className="font-barlow text-sm text-red-400">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-10 py-4 border-2 border-[#D3AF37] text-[#D3AF37] font-redzone text-lg md:text-xl
                         tracking-widest uppercase
                         transition-all duration-300
                         hover:bg-[#D3AF37] hover:text-black hover:shadow-[0_0_30px_rgba(211,175,55,0.4)]
                         disabled:opacity-50 disabled:pointer-events-none"
            >
              {submitting ? 'Sending...' : 'Get in touch'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default InquireScene
