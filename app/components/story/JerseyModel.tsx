'use client'

import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Box3, Vector3, Euler } from 'three'
import type { Group } from 'three'

interface ShaderWithWalk {
  uniforms: {
    time?: { value: number }
    stepPhase?: { value: number }
    walkStrength?: { value: number }
    floatPhase?: { value: number }
  }
}

const GLB_PATH = '/images/TifoJerseyV1.glb'

const SMOOTH_DAMP = 8

export function JerseyModel(props: React.JSX.IntrinsicElements['group']) {
  const groupRef = useRef<Group>(null)
  const spinGroupRef = useRef<Group>(null)
  const smoothPos = useRef(new Vector3(0, 0, 0))
  const smoothRot = useRef(new Euler(0, 0, 0))

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
      if (child.isMesh && child.material) {
        const material = child.material
        material.onBeforeCompile = (shader) => {
          shader.uniforms.time = { value: 0 }
          shader.uniforms.stepPhase = { value: 0 }
          shader.uniforms.walkStrength = { value: 0.48 }
          shader.uniforms.floatPhase = { value: 0 }

          shader.vertexShader =
            `
            uniform float time;
            uniform float stepPhase;
            uniform float walkStrength;
            uniform float floatPhase;
          ` + shader.vertexShader

          // Ousmane-style: floating + folds that move with each step
          shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            vec3 transformed = vec3(position);
            float phase = stepPhase * 6.28318;
            // Smooth gradient: 0 at center, 1 toward sides - prevents center split
            float sideBlend = smoothstep(0.0, 0.4, abs(position.x));
            // Smooth phase offset using position.x (no abrupt sign flip)
            float sidePhase = position.x * 2.5;
            // Hem factor: more deformation at bottom (fabric hangs, folds form there)
            float hemFactor = 0.3 + 0.7 * (0.5 + 0.5 * sin(position.y * 1.5));

            // FOLD 1: Vertical accordion creases - pulse with step (chest/abdomen)
            float foldVert = sin(position.y * 7.0 + phase * 2.0) * 0.025 * walkStrength * hemFactor;
            // FOLD 2: Diagonal twist folds - smooth wave across body
            float foldDiag = sin((position.y + position.x) * 6.0 + phase + sidePhase) * 0.022 * walkStrength * sideBlend;
            // FOLD 3: Hem bunching - soft horizontal waves
            float hemBunch = sin(position.x * 4.5 - phase * 1.5) * 0.028 * walkStrength * hemFactor;
            // FOLD 4: Soft horizontal ripple at step impact
            float foldHoriz = cos(position.y * 4.0 + phase) * 0.018 * walkStrength;
            // FOLD 5: Arm swing - gradient from center outward
            float armSwing = sin(phase + sidePhase) * 0.02 * walkStrength * sideBlend;

            // Apply folds (Z = toward camera, X = side)
            transformed.z += foldVert + foldHoriz;
            transformed.x += foldDiag + hemBunch + armSwing;

            // Stride sway: smooth wave, no hard center divide
            float strideSway = sin(phase + sidePhase) * 0.12 * walkStrength * hemFactor * sideBlend;
            transformed.x += strideSway;
            // Step billow: fabric bulges forward on push-off
            float stepBillow = sin(phase) * 0.08 * walkStrength * hemFactor;
            transformed.z += stepBillow;
            // Hem swing: smooth vertical wave
            float hemSwing = cos(phase + sidePhase) * 0.015 * walkStrength * hemFactor * sideBlend;
            transformed.y += hemSwing;
            // Breath/float wave
            transformed.y += sin(position.x * 3.0 + floatPhase) * 0.012 * walkStrength;

            // Gentle floating drift (slow sine overlay)
            transformed.y += sin(floatPhase * 0.5) * 0.008 * walkStrength;
            `
          )

          ;(child.userData as { shader?: ShaderWithWalk }).shader = shader
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
    const floatPhase = t * 0.4

    const group = groupRef.current
    const spinGroup = spinGroupRef.current
    if (group && spinGroup) {
      const blend = 1 - Math.exp(-SMOOTH_DAMP * delta)

      // Target values
      const float = Math.sin(floatPhase) * 0.08
      const bounce = -Math.cos(phaseRad * 2) * 0.03
      const targetY = float + bounce

      const spinSpeed = 0.7
      const targetRotX = Math.sin(phaseRad * 2) * 0.04
      const targetRotZ = Math.sin(phaseRad * 0.5) * 0.02

      // Smooth lerp for position and subtle rotations only
      smoothPos.current.y += (targetY - smoothPos.current.y) * blend
      smoothRot.current.x += (targetRotX - smoothRot.current.x) * blend
      smoothRot.current.z += (targetRotZ - smoothRot.current.z) * blend

      // Apply 360 spin directly on inner group (no smoothing - ensures full rotation)
      spinGroup.rotation.y = t * spinSpeed + Math.sin(phaseRad) * 0.08
      group.position.y = smoothPos.current.y
      spinGroup.rotation.x = smoothRot.current.x
      spinGroup.rotation.z = smoothRot.current.z
    }

    displayScene.traverse((child) => {
      const shader = (child.userData as { shader?: ShaderWithWalk }).shader
      if (shader) {
        shader.uniforms.time.value = t
        shader.uniforms.stepPhase.value = stepPhase
        shader.uniforms.floatPhase.value = floatPhase
      }
    })
  })

  return (
    <group ref={groupRef} {...props}>
      <group ref={spinGroupRef}>
        <primitive object={displayScene} position={offset} />
      </group>
    </group>
  )
}

useGLTF.preload(GLB_PATH)
