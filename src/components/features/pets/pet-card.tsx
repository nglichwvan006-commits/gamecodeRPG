'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { UserPet, PetRarity } from '@/types/pet'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  Flame, 
  Zap, 
  Ghost, 
  Sparkles, 
  Star,
  Shield,
  Activity
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PetCardProps {
  userPet: UserPet
  onToggleActive: (userPet: UserPet) => void
}

const RARITY_COLOR: Record<PetRarity, { color: string, border: string, bg: string, glow: string }> = {
  Common: { color: 'text-slate-400', border: 'border-slate-500/20', bg: 'bg-slate-500/5', glow: '' },
  Rare: { color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]' },
  Epic: { color: 'text-purple-400', border: 'border-purple-500/40', bg: 'bg-purple-500/10', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
  Legendary: { color: 'text-orange-400', border: 'border-orange-500/50', bg: 'bg-orange-500/10', glow: 'shadow-[0_0_25px_rgba(249,115,22,0.4)]' },
  Mythic: { color: 'text-red-500', border: 'border-red-500/60', bg: 'bg-red-500/15', glow: 'shadow-[0_0_35px_rgba(239,68,68,0.5)]' },
}

const PET_VISUALS: Record<string, { icon: any, animation: any, color: string }> = {
  'Baby Dragon': { 
    icon: Flame, 
    animation: {
      y: [0, -8, 0],
      rotate: [0, 2, -2, 0],
      scale: [1, 1.05, 1]
    },
    color: 'text-orange-500'
  },
  'Rubber Duck': { 
    icon: Zap, 
    animation: {
      x: [0, 4, -4, 0],
      scale: [1, 1.02, 0.98, 1],
      opacity: [0.8, 1, 0.8]
    },
    color: 'text-yellow-400'
  },
  'Code Owl': { 
    icon: Ghost, 
    animation: {
      y: [0, -3, 0],
      scaleX: [1, 1.1, 1],
      skewX: [0, 5, -5, 0],
      filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)']
    },
    color: 'text-blue-500'
  },
  'default': {
    icon: Star,
    animation: { y: [0, -5, 0] },
    color: 'text-primary'
  }
}

export function PetCard({ userPet, onToggleActive }: PetCardProps) {
  const { pet, is_active, level, xp } = userPet
  const rarity = RARITY_COLOR[pet.rarity] || RARITY_COLOR.Common
  const visual = PET_VISUALS[pet.name] || PET_VISUALS.default
  const Icon = visual.icon

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ y: -5 }}
            className="relative"
          >
            <Card className={cn(
              "relative overflow-hidden p-6 cursor-pointer transition-all duration-500 border-2",
              is_active ? "border-primary bg-primary/5 ring-1 ring-primary/20" : cn(rarity.border, rarity.bg),
              rarity.glow
            )}
            onClick={() => onToggleActive(userPet)}
            >
              {/* Active Badge */}
              <AnimatePresence>
                {is_active && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-2 right-2 z-10"
                  >
                    <Badge className="bg-primary text-primary-foreground font-black text-[8px] px-1.5 py-0 uppercase tracking-tighter">
                      Active Companion
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pet Visual Display */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {/* Idle Animation */}
                  <motion.div
                    animate={visual.animation}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={cn("relative z-10 p-4 rounded-3xl bg-background/50 border backdrop-blur-sm", visual.color)}
                  >
                    <Icon className="h-16 w-16" />
                  </motion.div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/20 blur-md rounded-full" />
                  {is_active && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
                    />
                  )}
                </div>

                {/* Name & Rarity */}
                <div className="text-center">
                  <h3 className="text-lg font-black uppercase tracking-tight">{pet.name}</h3>
                  <p className={cn("text-[10px] font-black uppercase tracking-[0.2em]", rarity.color)}>
                    {pet.rarity} Companion
                  </p>
                </div>

                {/* Level & XP */}
                <div className="w-full space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold opacity-60">
                    <span>LEVEL {level}</span>
                    <span>{xp}%</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${xp}%` }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                {/* Buff Indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background/50 border border-primary/10 w-full justify-center">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                    +{pet.buff_value}% {pet.buff_type.replace('_boost', '').replace('_', ' ')}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-64 p-4 space-y-2">
          <p className="text-xs font-medium italic text-muted-foreground">"{pet.description}"</p>
          <div className="pt-2 border-t">
            <p className="text-[10px] font-bold uppercase text-primary">Active Effect:</p>
            <p className="text-xs font-bold">{pet.name} provides a permanent {pet.buff_value}% boost to your {pet.buff_type.replace('_boost', '').replace('_', ' ')} while active.</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
