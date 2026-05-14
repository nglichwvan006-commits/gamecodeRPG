'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Sparkles, Coins, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface VictoryCinematicProps {
  bossName: string;
  rewards: {
    xp: number;
    coins: number;
    items?: string[];
  };
  onClose: () => void;
}

export function VictoryCinematic({ bossName, rewards, onClose }: VictoryCinematicProps) {
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowRewards(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/95 backdrop-blur-xl"
      />

      {/* Explosive Background Glow */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 2, 1.5], opacity: [0, 0.5, 0.2] }}
        transition={{ duration: 3, ease: "easeOut" }}
        className="absolute h-[800px] w-[800px] rounded-full bg-primary/20 blur-[120px]"
      />

      <div className="relative z-10 text-center space-y-12 max-w-2xl px-6">
        
        {/* Boss Defeated Banner */}
        <AnimatePresence>
          {!showRewards && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
              className="space-y-4"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: 4 }}
                className="text-primary"
              >
                <Trophy className="h-32 w-32 mx-auto drop-shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]" />
              </motion.div>
              <h1 className="text-6xl font-black uppercase tracking-tighter italic">BOSS SLAIN!</h1>
              <p className="text-2xl font-bold text-muted-foreground uppercase tracking-widest">{bossName} has been defeated</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rewards Section */}
        <AnimatePresence>
          {showRewards && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black uppercase italic text-primary flex items-center justify-center gap-3">
                  <Sparkles className="h-8 w-8" />
                  Epic Loot Unlocked
                  <Sparkles className="h-8 w-8" />
                </h2>
                <div className="h-1 w-32 bg-primary mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <RewardCard icon={Star} label="Experience" value={`+${rewards.xp} XP`} delay={0.2} />
                <RewardCard icon={Coins} label="Gold Coins" value={`+${rewards.coins}`} delay={0.4} />
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="pt-8"
              >
                <Button size="lg" className="px-12 py-8 text-xl font-black uppercase italic tracking-widest shadow-2xl shadow-primary/20" onClick={onClose}>
                  Continue Journey
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Particle Effects (Simulated) */}
      <AnimatePresence>
        {showRewards && [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '50vw', y: '50vh', opacity: 1, scale: 1 }}
            animate={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`,
              opacity: 0,
              scale: 0,
              rotate: 360
            }}
            transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
            className="absolute pointer-events-none text-primary/40"
          >
            <Star className="h-4 w-4 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function RewardCard({ icon: Icon, label, value, delay }: any) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring' }}
      className="bg-card/40 backdrop-blur-md border-2 border-primary/20 p-6 rounded-3xl space-y-2"
    >
      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2">
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{label}</p>
      <p className="text-2xl font-black tracking-tight">{value}</p>
    </motion.div>
  )
}
