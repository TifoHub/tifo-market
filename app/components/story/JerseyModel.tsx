'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3, Euler, Mesh } from 'three'
import type { Group } from 'three'

interface ShaderWithWalk {
  uniforms: {
    time: { value: number }
    stepPhase: { value: number }
    walkStrength: { value: number }
    floatPhase: { value: number }
  }
}

interface WebGLShaderParams {
  uniforms: Record<string, { value: unknown }>
  vertexShader: string
}

const GLB_PATH = '/images/TifoJerseyV1.glb'

const SMOOTH_DAMP = 14

export function JerseyModel(props: React.JSX.IntrinsicElements['group']) {
  const router = useRouter()
  const groupRef = useRef<Group>(null)
  const spinGroupRef = useRef<Group>(null)
  const smoothPos = useRef(new Vector3(0, 0, 0))
  const smoothRot = useRef(new Euler(0, 0, 0))
  const smoothStepPhase = useRef(0)
  const smoothFloatPhase = useRef(0)

  const goToShop = () => router.push('/shop')

  const { scene } = useGLTF(GLB_PATH)

  // Clone to avoid mutating the cached asset
  const displayScene = useMemo(() => scene.clone(), [scene])

  // Center the scene's geometry at the group origin so rotation pivots in place
  const offset = useMemo(() => {
    const box = new Box3().setFromObject(displayScene)
    const center = new Vector3()
    box.getCenter(center)
    return [-center.x, -center.y, -center.z] as [number, number, number]
  }, [displayScene])

  // Apply vertex shader: floating walk - step-synced folds, hem sway, gentle float
  useEffect(() => {
    displayScene.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const material = child.material
        material.onBeforeCompile = (shader: WebGLShaderParams) => {
          shader.uniforms.time = { value: 0 }
          shader.uniforms.stepPhase = { value: 0 }
          shader.uniforms.walkStrength = { value: 0.45 }
          shader.uniforms.floatPhase = { value: 0 }

          shader.vertexShader =
            `
            uniform float time;
            uniform float stepPhase;
            uniform float walkStrength;
            uniform float floatPhase;
          ` + shader.vertexShader

          // Cloth creases visible during walk - step-synced folds
          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            vec3 transformed = vec3(position);
            float phase = stepPhase * 6.28318;
            float sideBlend = smoothstep(0.0, 0.4, abs(position.x));
            float sidePhase = position.x * 2.5;
            float hemFactor = 0.3 + 0.7 * (0.5 + 0.5 * sin(position.y * 1.5));

            // Crease 1: Vertical accordion - chest/abdomen folds pulse with each step
            float foldVert = sin(position.y * 6.0 + phase * 2.0) * 0.02 * walkStrength * hemFactor;
            // Crease 2: Diagonal twist - fabric between arm and body
            float foldDiag = sin((position.y + position.x) * 5.0 + phase + sidePhase) * 0.018 * walkStrength * sideBlend;
            // Crease 3: Hem bunching - trailing side compresses when swaying
            float hemBunch = sin(position.x * 4.0 - phase * 1.5) * 0.022 * walkStrength * hemFactor;
            // Crease 4: Horizontal ripple at step impact
            float foldHoriz = cos(position.y * 4.0 + phase) * 0.014 * walkStrength;

            transformed.z += foldVert + foldHoriz;
            transformed.x += foldDiag + hemBunch;

            // Stride sway - alternating with step
            float strideSway = sin(phase + sidePhase) * 0.09 * walkStrength * hemFactor * sideBlend;
            transformed.x += strideSway;
            // Step billow - fabric bulges forward
            float stepBillow = sin(phase) * 0.055 * walkStrength * hemFactor;
            transformed.z += stepBillow;
            // Hem lift on trailing side
            float hemSwing = cos(phase + sidePhase) * 0.012 * walkStrength * hemFactor * sideBlend;
            transformed.y += hemSwing;

            // Ambient flow
            float flow = sin(position.y * 4.0 + floatPhase * 2.0) * 0.02 * walkStrength * hemFactor;
            transformed.z += flow;
            transformed.y += sin(position.x * 2.0 + floatPhase) * 0.008 * walkStrength;
            `
          )

          ;(child.userData as { shader?: ShaderWithWalk }).shader = shader as unknown as ShaderWithWalk
        }
      }
    })
  }, [displayScene])

  // Ousmane-style: floating walk - gentle levitation + step rhythm, sway + folds in shader
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const delta = state.clock.getDelta()
    const stepsPerSec = 0.6
    const stepPhase = (t * stepsPerSec) % 1.0
    const phaseRad = stepPhase * Math.PI * 2
    const floatPhase = t * 0.5

    const group = groupRef.current
    const spinGroup = spinGroupRef.current
    const blend = 1 - Math.exp(-SMOOTH_DAMP * delta)

    if (group && spinGroup) {
      // Target values
      const float = Math.sin(floatPhase) * 0.06
      const bounce = -Math.cos(phaseRad * 2) * 0.015
      const targetY = float + bounce

      const spinSpeed = 0.7
      const targetRotX = Math.sin(phaseRad * 2) * 0.025
      const targetRotZ = Math.sin(phaseRad * 0.5) * 0.01

      // Smooth lerp for position and subtle rotations only
      smoothPos.current.y += (targetY - smoothPos.current.y) * blend
      smoothRot.current.x += (targetRotX - smoothRot.current.x) * blend
      smoothRot.current.z += (targetRotZ - smoothRot.current.z) * blend

      // Apply 360 spin directly on inner group (no smoothing - ensures full rotation)
      spinGroup.rotation.y = t * spinSpeed + Math.sin(phaseRad) * 0.05
      group.position.y = smoothPos.current.y
      spinGroup.rotation.x = smoothRot.current.x
      spinGroup.rotation.z = smoothRot.current.z
    }

    smoothStepPhase.current += (stepPhase - smoothStepPhase.current) * blend
    smoothFloatPhase.current += (floatPhase - smoothFloatPhase.current) * blend

    displayScene.traverse((child) => {
      const shader = (child.userData as { shader?: ShaderWithWalk }).shader
      if (shader?.uniforms) {
        shader.uniforms.time.value = t
        shader.uniforms.stepPhase.value = smoothStepPhase.current
        shader.uniforms.floatPhase.value = smoothFloatPhase.current
      }
    })
  })

  return (
    <group
      ref={groupRef}
      {...props}
      onClick={goToShop}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <group ref={spinGroupRef}>
        <primitive object={displayScene} position={offset} />
      </group>
    </group>
  )
}

useGLTF.preload(GLB_PATH)
