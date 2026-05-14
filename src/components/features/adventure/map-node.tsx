'use client'

import { motion } from 'framer-motion'
import { Lock, CheckCircle2, ChevronRight, Star, Map as MapIcon, Compass, Skull } from 'lucide-react'
import { MapData } from '@/types/map'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

interface MapNodeProps {
  map: MapData
  index: number
}

const MAP_ICONS: Record<string, any> = {
  'Beginner Village': Compass,
  'Forest of Arrays': Star,
  'Stack Mountain': ChevronRight, // Placeholder
  'Graph Kingdom': MapIcon,
  'DP Temple': Star
}

export function MapNode({ map, index }: MapNodeProps) {
  const Icon = MAP_ICONS[map.name] || MapIcon
  const isOdd = index % 2 !== 0

  return (
    <div className={cn(
      "relative flex items-center gap-8 w-full max-w-4xl mx-auto py-12",
      isOdd ? "flex-row-reverse text-right" : "flex-row text-left"
    )}>
      
      {/* Node Visualization */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        whileHover={map.is_unlocked ? { scale: 1.1 } : {}}
        className="relative z-10"
      >
        <div className={cn(
          "h-24 w-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-2xl",
          map.is_unlocked 
            ? "bg-card border-primary text-primary shadow-primary/20" 
            : "bg-muted border-muted-foreground/20 text-muted-foreground opacity-60"
        )}>
          {map.is_unlocked ? (
            map.completion_percentage === 100 ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <Icon className="h-12 w-12" />
            )
          ) : (
            <Lock className="h-10 w-10" />
          )}
        </div>

        {/* Level Requirement Badge */}
        {!map.is_unlocked && (
          <Badge variant="destructive" className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase">
            Lvl {map.min_level} Required
          </Badge>
        )}
      </motion.div>

      {/* Connection Line */}
      <div className={cn(
        "absolute top-0 bottom-0 w-1 bg-border/40 z-0",
        isOdd ? "right-12" : "left-12"
      )} />

      {/* Info Card */}
      <motion.div
        initial={{ x: isOdd ? -50 : 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="flex-1"
      >
        <Card className={cn(
          "border-2 transition-all duration-300",
          map.is_unlocked ? "hover:border-primary/40 bg-card/50 backdrop-blur" : "opacity-60 grayscale bg-muted/20"
        )}>
          <CardContent className="p-6 space-y-4">
            <div className={cn("flex items-center gap-3", isOdd ? "flex-row-reverse" : "flex-row")}>
              <h2 className="text-2xl font-black uppercase tracking-tight">{map.name}</h2>
              {map.completion_percentage > 0 && (
                <Badge variant="outline" className="text-primary font-bold border-primary/20 bg-primary/5">
                  {map.completion_percentage}%
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "{map.description}"
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest opacity-60">
                <span>Progress</span>
                <span>{map.zones.filter(z => z.is_completed).length + map.bosses.filter(b => b.is_defeated).length} / {map.zones.length + map.bosses.length} Quests</span>
              </div>
              <Progress value={map.completion_percentage} className="h-2" />
            </div>

            {map.is_unlocked ? (
              <div className={cn("flex flex-wrap gap-2 pt-2", isOdd ? "justify-end" : "justify-start")}>
                {map.zones.map(zone => (
                  <Link key={zone.id} href={`/problems/${zone.problem_id}`}>
                    <Badge 
                      className={cn(
                        "cursor-pointer transition-colors px-3 py-1",
                        zone.is_completed 
                          ? "bg-green-500/20 text-green-500 border-green-500/30 hover:bg-green-500/30" 
                          : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      )}
                    >
                      {zone.name}
                    </Badge>
                  </Link>
                ))}

                {/* Bosses */}
                {map.bosses.map(boss => (
                  <Link key={boss.id} href={boss.is_unlocked ? `/problems/${boss.problem_id}?bossId=${boss.id}` : '#'}>
                    <Badge 
                      className={cn(
                        "cursor-pointer transition-all px-3 py-1 border-2 flex items-center gap-1.5",
                        boss.is_defeated
                          ? "bg-yellow-500/20 text-yellow-600 border-yellow-500/30 line-through opacity-60"
                          : boss.is_unlocked
                            ? "bg-red-500 text-white border-red-600 animate-pulse hover:scale-105"
                            : "bg-muted text-muted-foreground border-border/50 cursor-not-allowed"
                      )}
                    >
                      <Skull className="h-3 w-3" />
                      BOSS: {boss.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs font-bold text-destructive uppercase tracking-tighter pt-2">
                Continue your journey to unlock this territory.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
