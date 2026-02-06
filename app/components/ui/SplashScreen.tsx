'use client'
import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'

const SplashScreen = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(false)
  const [splashDone, setSplashDone] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check if splash has already been shown this session
    const hasPlayed = sessionStorage.getItem('splash-played')
    if (!hasPlayed) {
      setShowSplash(true)
      // Prevent scrolling while splash is active
      document.body.style.overflow = 'hidden'
    } else {
      setSplashDone(true)
    }
  }, [])

  const handleVideoEnd = () => {
    // Mark as played for this session
    sessionStorage.setItem('splash-played', 'true')

    // Animate the overlay out
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        setShowSplash(false)
        setSplashDone(true)
        document.body.style.overflow = ''
      },
    })
  }

  // Skip splash on click/tap
  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    handleVideoEnd()
  }

  return (
    <>
      {showSplash && (
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
            onClick={handleSkip}
            className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm tracking-widest uppercase transition-colors"
          >
            Skip
          </button>
        </div>
      )}
      {(splashDone || !showSplash) ? children : null}
    </>
  )
}

export default SplashScreen
