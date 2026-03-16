'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center } from '@react-three/drei'
import { JerseyModel } from './JerseyModel'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = () => setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

export function MerchScene3D() {
  const isMobile = useIsMobile()

  return (
    <div
      className="absolute inset-0 w-full h-full min-h-[400px] pointer-events-none"
      style={{ minHeight: '100%' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        frameloop="always"
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <directionalLight position={[-3, -2, 2]} intensity={1} />
        <pointLight position={[0, 2, 2]} intensity={1} />
        <Suspense fallback={null}>
          <Center>
            <JerseyModel scale={isMobile ? 0.65 : 0.9} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  )
}
