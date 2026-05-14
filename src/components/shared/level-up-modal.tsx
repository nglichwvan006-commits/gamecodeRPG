'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Coins, Zap, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'

interface LevelUpModalProps {
  isOpen: boolean
  onClose: () => void
  newLevel: number
  rewards: {
    xp: number
    coins: number
  }
}

export function LevelUpModal({ isOpen, onClose, newLevel, rewards }: LevelUpModalProps) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowContent(true), 500)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden border-none bg-transparent shadow-none p-0">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative rounded-3xl bg-card p-8 text-center border-2 border-primary/20 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
              
              {/* Animated Particles (Simplified) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-primary/40"
                    animate={{
                      y: [-20, 400],
                      x: [Math.random() * 400, Math.random() * 400],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 2,
                    }}
                    style={{ left: `${Math.random() * 100}%`, top: '-20px' }}
                  />
                ))}
              </div>

              <div className="relative z-10 space-y-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 shadow-lg shadow-primary/20"
                >
                  <Trophy className="h-10 w-10 text-primary animate-bounce" />
                </motion.div>

                <div className="space-y-2">
                  <motion.h2
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
                    className="text-4xl font-black uppercase tracking-tighter text-primary"
                  >
                    Level Up!
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-muted-foreground font-medium"
                  >
                    You have reached <span className="text-foreground font-bold text-xl">Level {newLevel}</span>
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="rounded-2xl bg-secondary/50 p-4 border border-border/50">
                    <div className="flex flex-col items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-bold">+{rewards.xp}</span>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">XP Gained</span>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-secondary/50 p-4 border border-border/50">
                    <div className="flex flex-col items-center gap-1">
                      <Coins className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-bold">+{rewards.coins}</span>
                      <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Gold Earned</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button onClick={onClose} className="w-full h-12 text-lg rounded-xl shadow-xl shadow-primary/20 group">
                    Continue Journey
                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
