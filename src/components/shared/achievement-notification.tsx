'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Sparkles, X } from 'lucide-react'
import { useAchievementNotificationStore } from '@/store/use-achievement-notification-store'
import { Badge } from '@/components/ui/badge'

export function AchievementNotification() {
  const { queue, isShowing, hideCurrent } = useAchievementNotificationStore()
  const current = queue[0]

  useEffect(() => {
    if (isShowing && current) {
      // Auto-remove after 5 seconds
      const timer = setTimeout(() => {
        hideCurrent()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isShowing, current, hideCurrent])

  const handleClose = () => {
    hideCurrent()
  }

  return (
    <div className="fixed bottom-6 right-6 z-[300] pointer-events-none">
      <AnimatePresence>
        {isShowing && current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="pointer-events-auto relative w-80 overflow-hidden rounded-2xl border-2 border-yellow-500/50 bg-card p-4 shadow-2xl shadow-yellow-500/20 backdrop-blur-xl"
          >
            {/* Animated Background Rays */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent opacity-50" />
            
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                  <Trophy className="h-6 w-6" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1 text-yellow-400"
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-yellow-500/30 bg-yellow-500/10 text-[10px] font-bold uppercase tracking-widest text-yellow-600">
                    Achievement Unlocked
                  </Badge>
                  <button 
                    onClick={handleClose}
                    className="rounded-full p-1 hover:bg-muted transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
                <h4 className="text-sm font-black tracking-tight">{current.name}</h4>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {current.description}
                </p>
                <div className="flex items-center gap-1 pt-1 text-[10px] font-bold text-yellow-600 uppercase tracking-tighter">
                  <Star className="h-3 w-3 fill-current" />
                  Gained +50 EXP
                </div>
              </div>
            </div>

            {/* Bottom Progress Bar (Timer) */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-yellow-500/50"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
