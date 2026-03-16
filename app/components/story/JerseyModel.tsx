'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'
import type { Group } from 'three'

const GLB_PATH = '/images/TifoJerseyV1.glb'

export function JerseyModel(props: React.JSX.IntrinsicElements['group']) {
  const groupRef = useRef<Group>(null)

  const { scene } = useGLTF(GLB_PATH)

  // Center the scene's geometry at the group origin so rotation pivots in place
  const offset = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    const center = new Vector3()
    box.getCenter(center)
    return [-center.x, -center.y, -center.z] as [number, number, number]
  }, [scene])

  // Rotate in place around Y axis (spin, not orbit)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} position={offset} />
    </group>
  )
}

useGLTF.preload(GLB_PATH)
