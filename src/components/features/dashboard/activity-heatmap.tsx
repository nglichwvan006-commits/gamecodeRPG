'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { streakService } from '@/services/streak-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import React, { memo } from 'react'

interface ActivityHeatmapProps {
  userId: string
}

export const ActivityHeatmap = memo(function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
  const { data: activities, isLoading } = useQuery({
    queryKey: ['user-activities', userId],
    queryFn: () => streakService.getActivityHistory(userId),
    enabled: !!userId,
  })

  if (isLoading) return <Skeleton className="h-48 w-full rounded-xl" />

  // Generate last 365 days
  const today = new Date()
  const days = Array.from({ length: 365 }, (_, i) => {
    const d = new Date()
    d.setDate(today.getDate() - (364 - i))
    return d.toISOString().split('T')[0]
  })

  const activitySet = new Set(activities || [])

  // Group by weeks for the grid
  const weeks: string[][] = []
  let currentWeek: string[] = []

  // Pad the first week if necessary
  const firstDay = new Date(days[0])
  const firstDayOfWeek = firstDay.getDay() // 0 is Sunday
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push('')
  }

  days.forEach(day => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) weeks.push(currentWeek)

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Activity History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
            <TooltipProvider>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1 shrink-0">
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="w-3 h-3" />
                    const hasActivity = activitySet.has(day)
                    return (
                      <Tooltip key={day || di}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: (wi * 0.01) + (di * 0.005) }}
                            className={`w-3 h-3 rounded-[2px] cursor-pointer transition-colors ${
                              hasActivity 
                                ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]' 
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-[10px] font-bold">
                          {day}: {hasActivity ? 'Active' : 'No activity'}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              ))}
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-tighter pt-2 border-t border-primary/10">
            <div className="flex gap-4">
              <span>{activities?.length || 0} days active this year</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-[2px] bg-muted" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/40" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-primary/70" />
              <div className="w-2.5 h-2.5 rounded-[2px] bg-primary" />
              <span>More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
ActivityHeatmap.displayName = 'ActivityHeatmap'
