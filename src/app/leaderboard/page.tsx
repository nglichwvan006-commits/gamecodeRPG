'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, Medal, Crown, Star, Sword, 
  Flame, Target, Skull, User, Search,
  Loader2, ChevronRight, TrendingUp
} from 'lucide-react'
import { leaderboardService, LeaderboardMetric, LeaderboardEntry } from '@/services/leaderboard-service'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const METRICS: { value: LeaderboardMetric; label: string; icon: any; color: string }[] = [
  { value: 'level', label: 'Level', icon: Star, color: 'text-yellow-500' },
  { value: 'xp', label: 'Experience', icon: TrendingUp, color: 'text-blue-500' },
  { value: 'problems_solved', label: 'Quests', icon: Target, color: 'text-green-500' },
  { value: 'bosses_defeated', label: 'Bosses', icon: Skull, color: 'text-red-500' },
  { value: 'current_streak', label: 'Streak', icon: Flame, color: 'text-orange-500' },
]

export default function LeaderboardPage() {
  const [activeMetric, setActiveMetric] = useState<LeaderboardMetric>('level')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', activeMetric],
    queryFn: () => leaderboardService.getLeaderboard(activeMetric),
  })

  const filteredLeaderboard = leaderboard?.filter(entry => 
    entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const topThree = leaderboard?.slice(0, 3) || []
  const restOfPlayers = filteredLeaderboard?.slice(3) || []

  return (
    <div className="container py-8 space-y-8 max-w-5xl">
      <section className="text-center space-y-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
        >
          <Trophy className="h-4 w-4" />
          Global Hall of Fame
        </motion.div>
        <motion.h1 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black tracking-tighter"
        >
          THE ELITE <span className="text-primary">ADVENTURERS</span>
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Witness the legends of the Arena. Only the strongest and most dedicated coders 
          rise to the top of these rankings.
        </motion.p>
      </section>

      <Tabs defaultValue="level" value={activeMetric} onValueChange={(v) => setActiveMetric(v as LeaderboardMetric)} className="w-full">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <TabsList className="bg-card border h-auto p-1 grid grid-cols-3 md:flex md:flex-wrap gap-1">
            {METRICS.map((m) => (
              <TabsTrigger 
                key={m.value} 
                value={m.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2 px-4"
              >
                <m.icon className="h-4 w-4 mr-2 hidden sm:inline" />
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search adventurer..." 
              className="pl-9 bg-card border-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value={activeMetric} className="mt-0 space-y-12">
          {/* Top 3 Podium */}
          {!isLoading && topThree.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-12">
              {/* Silver - Rank 2 */}
              <PodiumPlace entry={topThree[1]} rank={2} metric={activeMetric} delay={0.2} />
              {/* Gold - Rank 1 */}
              <PodiumPlace entry={topThree[0]} rank={1} metric={activeMetric} delay={0.1} isCenter />
              {/* Bronze - Rank 3 */}
              <PodiumPlace entry={topThree[2]} rank={3} metric={activeMetric} delay={0.3} />
            </div>
          )}

          {/* List View */}
          <Card className="border-primary/20 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-primary/10 bg-muted/30">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Rank</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Adventurer</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">LVL</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Quests</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Bosses</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">Streak</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-foreground text-right">XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i} className="border-b border-primary/5">
                          <td colSpan={7} className="px-6 py-4">
                            <Skeleton className="h-12 w-full" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <AnimatePresence mode="popLayout">
                        {restOfPlayers.map((entry, index) => (
                          <motion.tr 
                            key={entry.profile_id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="border-b border-primary/5 hover:bg-primary/5 transition-colors group"
                          >
                            <td className="px-6 py-4">
                              <span className="font-black text-muted-foreground/50 group-hover:text-primary transition-colors">
                                #{index + 4}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-primary/20">
                                  <AvatarImage src={entry.avatar_url} />
                                  <AvatarFallback>{entry.username[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-bold text-sm leading-none">{entry.full_name || entry.username}</p>
                                  <p className="text-[10px] text-muted-foreground mt-1">@{entry.username}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge variant="outline" className="font-bold border-primary/20">
                                {entry.level}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-sm">
                              {entry.problems_solved}
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-sm">
                              {entry.bosses_defeated}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1 text-orange-500">
                                <Flame className="h-3 w-3 fill-current" />
                                <span className="text-sm font-bold">{entry.current_streak}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="text-sm font-black text-primary">
                                {entry.xp.toLocaleString()}
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
                {!isLoading && filteredLeaderboard?.length === 0 && (
                  <div className="py-20 text-center space-y-3">
                    <User className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                    <p className="text-muted-foreground font-medium">No adventurers found matching your search.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PodiumPlace({ entry, rank, metric, delay, isCenter = false }: { 
  entry: LeaderboardEntry; 
  rank: number; 
  metric: LeaderboardMetric;
  delay: number;
  isCenter?: boolean 
}) {
  if (!entry) return null

  const icons = {
    1: <Crown className="h-8 w-8 text-yellow-500 fill-current" />,
    2: <Medal className="h-8 w-8 text-slate-400 fill-current" />,
    3: <Medal className="h-8 w-8 text-amber-700 fill-current" />,
  }

  const heights = {
    1: 'h-64',
    2: 'h-48',
    3: 'h-40',
  }

  const metricLabel = METRICS.find(m => m.value === metric)?.label
  const metricValue = entry[metric as keyof LeaderboardEntry]

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className={cn(
        "flex flex-col items-center relative",
        isCenter ? "z-10 order-1 md:order-2" : rank === 2 ? "order-2 md:order-1" : "order-3"
      )}
    >
      <div className="mb-4 relative">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Avatar className={cn(
            "border-4 shadow-2xl",
            rank === 1 ? "h-32 w-32 border-yellow-500" : 
            rank === 2 ? "h-24 w-24 border-slate-400" : 
            "h-20 w-20 border-amber-700"
          )}>
            <AvatarImage src={entry.avatar_url} />
            <AvatarFallback>{entry.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </motion.div>
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          {icons[rank as keyof typeof icons]}
        </div>
      </div>

      <div className="text-center mb-4">
        <h3 className="font-black text-lg truncate max-w-[150px]">{entry.full_name || entry.username}</h3>
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">@{entry.username}</p>
      </div>

      <div className={cn(
        "w-full rounded-t-3xl flex flex-col items-center justify-start pt-8 px-4 gap-2 border-x border-t bg-gradient-to-b from-primary/20 to-transparent",
        heights[rank as keyof typeof heights],
        rank === 1 ? "border-yellow-500/30" : rank === 2 ? "border-slate-400/30" : "border-amber-700/30"
      )}>
        <Badge variant="secondary" className="font-black text-lg px-4 py-1">
          #{rank}
        </Badge>
        <div className="text-center mt-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{metricLabel}</p>
          <p className="text-2xl font-black text-primary">
            {typeof metricValue === 'number' ? metricValue.toLocaleString() : metricValue}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
