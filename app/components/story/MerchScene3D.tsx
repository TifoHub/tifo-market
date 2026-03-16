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
      className="absolute inset-0 w-full h-full min-h-[400px]"
      style={{ minHeight: '100%' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        frameloop="always"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 4]} intensity={3} />
        <directionalLight position={[-3, 2, 3]} intensity={1.5} />
        <directionalLight position={[0, 3, -4]} intensity={2} />
        <pointLight position={[2, 1, 3]} intensity={1.5} />
        <pointLight position={[-1, 0, 2]} intensity={0.8} />
        <Suspense fallback={null}>
          <Center>
            <JerseyModel scale={isMobile ? 0.65 : 0.9} />
          </Center>
        </Suspense>
      </Canvas>
    </div>
  )
}
