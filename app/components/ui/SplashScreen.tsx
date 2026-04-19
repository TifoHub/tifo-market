'use client'
import React, { useRef, useState, useLayoutEffect } from 'react'
import gsap from 'gsap'

type SplashPhase = 'boot' | 'splash' | 'content'

const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [phase, setPhase] = useState<SplashPhase>('boot')
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useLayoutEffect(() => {
    const hasPlayed = sessionStorage.getItem('splash-played')
    if (hasPlayed) {
      setPhase('content')
    } else {
      document.body.style.overflow = 'hidden'
      setPhase('splash')
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const finishSplash = () => {
    sessionStorage.setItem('splash-played', 'true')
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        setPhase('content')
        document.body.style.overflow = ''
      },
    })
  }

  const handleVideoEnd = () => {
    finishSplash()
  }

  const handleSkip = () => {
    videoRef.current?.pause()
    finishSplash()
  }

  // Do not mount children during `boot` or `splash`. Mounting then unmounting
  // breaks GSAP ScrollTrigger pin (reparents DOM) → React removeChild errors.
  if (phase === 'boot') {
    return <div className="min-h-screen bg-black" aria-busy="true" />
  }

  return (
    <>
      {phase === 'splash' && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={handleSkip}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            src="/scenesmedia/Tifo-Hero.mp4"
          />
          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm tracking-widest uppercase transition-colors"
          >
            Skip
          </button>
        </div>
      )}
      {phase === 'content' && children}
    </>
  )
}

export default SplashScreen
