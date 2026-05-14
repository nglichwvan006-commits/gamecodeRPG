'use client'

import React, { memo } from 'react'
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// --- Types ---
interface BaseAnimationProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

// --- FadeIn ---
export const FadeIn = memo(({ children, delay = 0, duration = 0.5, className, ...props }: BaseAnimationProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
))
FadeIn.displayName = 'FadeIn'

// --- SlideUp ---
export const SlideUp = memo(({ children, delay = 0, duration = 0.5, className, ...props }: BaseAnimationProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
))
SlideUp.displayName = 'SlideUp'

// --- ScaleIn ---
export const ScaleIn = memo(({ children, delay = 0, duration = 0.4, className, ...props }: BaseAnimationProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration, delay, type: 'spring', stiffness: 260, damping: 20 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
))
ScaleIn.displayName = 'ScaleIn'

// --- Floating ---
export const Floating = memo(({ children, duration = 3, className, ...props }: BaseAnimationProps) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
))
Floating.displayName = 'Floating'

// --- GlowPulse ---
export const GlowPulse = memo(({ children, color = 'var(--primary)', className, ...props }: BaseAnimationProps & { color?: string }) => (
  <motion.div
    animate={{ 
      boxShadow: [
        `0 0 0px 0px ${color}33`, 
        `0 0 20px 2px ${color}66`, 
        `0 0 0px 0px ${color}33`
      ] 
    }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    className={cn("rounded-full", className)}
    {...props}
  >
    {children}
  </motion.div>
))
GlowPulse.displayName = 'GlowPulse'

// --- ParticleBackground ---
export const ParticleBackground = memo(({ count = 20, color = 'primary' }: { count?: number, color?: string }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className={cn(
          "absolute h-1 w-1 rounded-full",
          color === 'primary' ? "bg-primary/20" : "bg-white/20"
        )}
        animate={{
          y: [-20, 1000],
          x: [Math.random() * 100 + '%', Math.random() * 100 + '%'],
          opacity: [0, 0.8, 0],
          scale: [0, 1.5, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 5,
        }}
        style={{ left: `${Math.random() * 100}%`, top: '-5%' }}
      />
    ))}
  </div>
))
ParticleBackground.displayName = 'ParticleBackground'

// --- ConfettiBurst ---
export const ConfettiBurst = memo(({ isActive }: { isActive: boolean }) => (
  <AnimatePresence>
    {isActive && (
      <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
        {[...Array(50)].map((_, i) => {
          const angle = (i / 50) * Math.PI * 2
          const velocity = 200 + Math.random() * 300
          const xDest = Math.cos(angle) * velocity
          const yDest = Math.sin(angle) * velocity
          
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{ 
                x: xDest, 
                y: yDest, 
                opacity: 0, 
                scale: Math.random() * 1.5,
                rotate: 360 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "absolute h-2 w-2 rounded-sm",
                ["bg-yellow-500", "bg-primary", "bg-blue-500", "bg-pink-500", "bg-green-500"][i % 5]
              )}
            />
          )
        })}
      </div>
    )}
  </AnimatePresence>
))
ConfettiBurst.displayName = 'ConfettiBurst'
