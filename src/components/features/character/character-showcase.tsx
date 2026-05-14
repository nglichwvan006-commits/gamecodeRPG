'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Shield, Zap, Sword, Flame, Star, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface CharacterShowcaseProps {
  characterClass?: string
  level?: number
  className?: string
}

export const CharacterShowcase = React.memo(function CharacterShowcase({ characterClass = 'Warrior', level = 10, className }: CharacterShowcaseProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  // Parallax values based on mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for parallax
  const springConfig = { damping: 25, stiffness: 150 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)
  const characterX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig)
  const characterY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-15, 15]), springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  return (
    <div 
      className={cn("relative w-full aspect-[4/5] max-w-md mx-auto group cursor-none perspective-1000", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Container with tilt effect */}
      <motion.div 
        style={{ rotateX, rotateY }}
        className="relative w-full h-full rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-b from-card to-background shadow-2xl"
      >
        {/* Background Aura / Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent blur-3xl"
          />
        </div>

        {/* Parallax Background Grid */}
        <motion.div 
          style={{ x: useTransform(mouseX, [-0.5, 0.5], [10, -10]), y: useTransform(mouseY, [-0.5, 0.5], [10, -10]) }}
          className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        />

        {/* Character Stage / Floor */}
        <div className="absolute bottom-0 inset-x-0 h-1/4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Main Character Illustration (Simulated with complex SVG and Framer Motion) */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div 
            style={{ x: characterX, y: characterY }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Dynamic Shadow */}
            <motion.div 
              animate={{ 
                scaleX: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-4 h-4 w-32 bg-black/40 blur-md rounded-full"
            />

            {/* Breathing & Floating Body Container */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Silhouette / Body Placeholder (Polished with gradients) */}
              <div className="relative">
                <div className="w-48 h-64 bg-gradient-to-b from-primary/80 to-primary/20 rounded-t-[100px] rounded-b-[40px] shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)]">
                  {/* Decorative Armor Lines */}
                  <div className="absolute top-1/4 inset-x-4 h-1 bg-white/10 rounded-full" />
                  <div className="absolute top-1/3 inset-x-8 h-1 bg-white/10 rounded-full" />
                </div>
                
                {/* Head */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-primary/90 rounded-full shadow-lg border-4 border-background" />

                {/* Glowing Weapon (Sword) */}
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-12 top-1/2 -translate-y-1/2"
                >
                  <div className="relative group/weapon">
                    <Sword className="h-48 w-48 text-primary opacity-80 rotate-12" />
                    {/* Weapon Glow Effect */}
                    <motion.div 
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 blur-lg text-primary rotate-12"
                    >
                      <Sword className="h-48 w-48 fill-current" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Glowing Shield */}
                <motion.div
                  animate={{ rotate: [0, -5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -left-8 top-1/2 -translate-y-1/2"
                >
                  <Shield className="h-32 w-32 text-primary/60" />
                </motion.div>
              </div>

              {/* Aura Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    y: [0, -150],
                    x: Math.sin(i) * 100
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute h-2 w-2 bg-primary rounded-full blur-[1px]"
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Character Info Overlay */}
        <div className="absolute top-6 left-6 space-y-1">
          <Badge className="bg-primary/20 text-primary border-primary/30 uppercase tracking-widest font-black">
            {characterClass}
          </Badge>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black italic tracking-tighter">LEVEL {level}</h2>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("h-3 w-3", i < 4 ? "text-yellow-500 fill-current" : "text-muted-foreground")} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats Bars */}
        <div className="absolute bottom-8 inset-x-8 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-red-500 flex items-center gap-1"><Flame className="h-3 w-3" /> Health</span>
              <span>100%</span>
            </div>
            <div className="h-1.5 w-full bg-red-950 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-full bg-red-500 shadow-[0_0_10px_#ef4444]"
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-blue-500 flex items-center gap-1"><Zap className="h-3 w-3" /> Mana</span>
              <span>85%</span>
            </div>
            <div className="h-1.5 w-full bg-blue-950 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "85%" }}
                className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Custom Cursor (when hovered) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[200] flex items-center justify-center"
        style={{ 
          x: useSpring(useMotionValue(0), { damping: 20, stiffness: 200 }), 
          y: useSpring(useMotionValue(0), { damping: 20, stiffness: 200 }),
          opacity: isHovered ? 1 : 0 
        }}
      >
        <div className="relative">
          <Sparkles className="h-6 w-6 text-primary animate-spin-slow" />
          <motion.div 
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 blur-md rounded-full" 
          />
        </div>
      </motion.div>
    </div>
  )
})

CharacterShowcase.displayName = 'CharacterShowcase'
