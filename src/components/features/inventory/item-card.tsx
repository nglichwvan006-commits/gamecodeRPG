'use client'

import { motion } from 'framer-motion'
import { Sword, Shield, Zap, Sparkles, FlaskConical, Package } from 'lucide-react'
import { InventoryItem, ItemRarity, UserInventoryItem } from '@/types/inventory'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ItemCardProps {
  userItem: UserInventoryItem
  onAction?: (item: UserInventoryItem) => void
  actionLabel?: string
}

const RARITY_CONFIG: Record<ItemRarity, { color: string, bg: string, border: string, glow: string }> = {
  Common: { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', glow: '' },
  Rare: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]' },
  Epic: { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/40', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]' },
  Legendary: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/50', glow: 'shadow-[0_0_25px_rgba(249,115,22,0.5)]' },
  Mythic: { color: 'text-red-500', bg: 'bg-red-500/15', border: 'border-red-500/60', glow: 'shadow-[0_0_35px_rgba(239,68,68,0.6)]' },
}

const TYPE_ICON: Record<string, any> = {
  Weapon: Sword,
  Armor: Shield,
  Accessory: Zap,
  Potion: FlaskConical,
  Material: Package,
}

export function ItemCard({ userItem, onAction, actionLabel }: ItemCardProps) {
  const { item, is_equipped, quantity } = userItem
  const config = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.Common
  const Icon = TYPE_ICON[item.type] || Package

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Card className={cn(
              "relative aspect-square flex flex-col items-center justify-center p-2 cursor-pointer transition-all duration-300",
              config.bg,
              config.border,
              config.glow,
              is_equipped && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
            onClick={() => onAction?.(userItem)}
            >
              {is_equipped && (
                <div className="absolute top-1 right-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
              
              <div className={cn("mb-1", config.color)}>
                <Icon className="h-8 w-8" />
              </div>

              <div className="text-[10px] font-bold text-center line-clamp-1 opacity-80 uppercase tracking-tighter">
                {item.name}
              </div>

              {quantity > 1 && (
                <div className="absolute bottom-1 right-1 bg-secondary px-1 rounded text-[8px] font-black">
                  x{quantity}
                </div>
              )}

              {/* Rarity Indicator */}
              <div className={cn("absolute bottom-0 left-0 w-full h-0.5", config.bg.replace('/10', '/50'))} />
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="w-64 p-0 overflow-hidden bg-card border-2">
          <div className={cn("px-4 py-2 border-b flex justify-between items-center", config.bg)}>
            <span className={cn("text-xs font-black uppercase tracking-widest", config.color)}>
              {item.rarity} {item.type}
            </span>
            {is_equipped && <span className="text-[10px] font-bold text-primary">EQUIPPED</span>}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h4 className="font-bold text-sm">{item.name}</h4>
              <p className="text-[11px] text-muted-foreground italic leading-tight">
                {item.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {Object.entries(item.stats_boost).map(([stat, value]) => (
                <div key={stat} className="flex items-center gap-1.5 bg-muted/50 p-1.5 rounded-lg border border-border/50">
                  <span className="text-[10px] font-bold uppercase opacity-60">{stat}</span>
                  <span className="text-xs font-black text-primary">+{value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase">
              <span>Value: {item.price} Coins</span>
              <span className="text-primary">{actionLabel || (is_equipped ? 'Click to Unequip' : 'Click to Equip')}</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
