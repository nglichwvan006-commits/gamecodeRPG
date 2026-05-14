'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Circle, Coins, Loader2, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

import { dailyQuestService } from '@/services/daily-quest-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

import React, { memo } from 'react'

interface DailyQuestsProps {
  userId: string
}

export const DailyQuests = memo(function DailyQuests({ userId }: DailyQuestsProps) {
  const queryClient = useQueryClient()

  const { data: quests, isLoading } = useQuery({
    queryKey: ['daily-quests', userId],
    queryFn: () => dailyQuestService.getDailyQuests(userId),
    enabled: !!userId,
  })

  const claimMutation = useMutation({
    mutationFn: (questId: string) => dailyQuestService.claimReward(userId, questId),
    onSuccess: (coins) => {
      toast.success(`Claimed ${coins} coins!`)
      queryClient.invalidateQueries({ queryKey: ['daily-quests', userId] })
      queryClient.invalidateQueries({ queryKey: ['character', userId] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to claim reward')
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Daily Quests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  const allCompleted = quests?.every((q) => q.is_completed)
  const completedCount = quests?.filter((q) => q.is_completed).length || 0

  return (
    <Card className="overflow-hidden border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Daily Quests</CardTitle>
              <p className="text-xs text-muted-foreground font-medium">
                {completedCount} / {quests?.length || 0} Completed
              </p>
            </div>
          </div>
          {allCompleted && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600 animate-pulse">
              All Done!
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {quests?.map((quest) => {
            const progress = (quest.current_value / quest.daily_quest.goal_value) * 100
            
            return (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`relative group p-4 rounded-xl border transition-all duration-300 ${
                  quest.is_completed 
                    ? 'bg-primary/5 border-primary/30' 
                    : 'bg-background/50 border-border hover:border-primary/20'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {quest.is_completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <h4 className="font-bold text-sm tracking-tight">{quest.daily_quest.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {quest.daily_quest.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                      <Coins className="h-3 w-3 text-yellow-500" />
                      <span className="text-[10px] font-bold text-yellow-600">+{quest.daily_quest.reward_coins}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className={quest.is_completed ? 'text-primary' : 'text-muted-foreground'}>
                      Progress
                    </span>
                    <span>
                      {quest.current_value} / {quest.daily_quest.goal_value}
                    </span>
                  </div>
                  <Progress value={progress} className={`h-1.5 transition-all duration-500 ${quest.is_completed ? 'bg-primary/20' : ''}`} />
                </div>

                {quest.is_completed && !quest.is_claimed && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4"
                  >
                    <Button 
                      className="w-full h-9 rounded-lg font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                      onClick={() => claimMutation.mutate(quest.id)}
                      disabled={claimMutation.isPending}
                    >
                      {claimMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Claim Reward'
                      )}
                    </Button>
                  </motion.div>
                )}

                {quest.is_claimed && (
                  <div className="mt-4 flex items-center justify-center py-2 px-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Reward Claimed</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
})
DailyQuests.displayName = 'DailyQuests'
