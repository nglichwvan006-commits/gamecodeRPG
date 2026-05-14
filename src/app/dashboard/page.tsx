'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Sword, Shield, Zap, Coins, Trophy, 
  Flame, Play, User, Package, Map as MapIcon
} from 'lucide-react'
import Link from 'next/link'

import { useAuthStore } from '@/store/use-auth-store'
import { characterService } from '@/services/character-service'
import { rewardService } from '@/services/reward-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const DailyQuests = dynamic(() => import('@/components/features/quests/daily-quests').then(mod => mod.DailyQuests), { ssr: false })
const ActivityHeatmap = dynamic(() => import('@/components/features/dashboard/activity-heatmap').then(mod => mod.ActivityHeatmap), { 
  loading: () => <Skeleton className="h-48 w-full rounded-xl" />,
  ssr: false 
})
const CharacterShowcase = dynamic(() => import('@/components/features/character/character-showcase').then(mod => mod.CharacterShowcase), { 
  loading: () => <Skeleton className="aspect-[4/5] w-full max-w-md mx-auto rounded-3xl" />,
  ssr: false 
})

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: character, isLoading: charLoading } = useQuery({
    queryKey: ['character', user?.id],
    queryFn: () => characterService.getCharacterData(user!.id),
    enabled: !!user?.id,
  })

  const { data: activePet, isLoading: petLoading } = useQuery({
    queryKey: ['activePet', user?.id],
    queryFn: () => characterService.getActivePet(user!.id),
    enabled: !!user?.id,
  })

  const { data: achievements, isLoading: achLoading } = useQuery({
    queryKey: ['recentAchievements', user?.id],
    queryFn: () => characterService.getRecentAchievements(user!.id),
    enabled: !!user?.id,
  })

  const { data: streak, isLoading: streakLoading } = useQuery({
    queryKey: ['streak', user?.id],
    queryFn: () => characterService.getStreak(user!.id),
    enabled: !!user?.id,
  })

  if (charLoading) return <DashboardSkeleton />

  const requiredExp = rewardService.calculateRequiredExp(character?.level || 1)
  const expProgress = ((character?.xp || 0) / requiredExp) * 100

  return (
    <div className="container py-8 space-y-8">
      {/* Top Welcome Bar */}
      <section className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Welcome back, <span className="text-primary">{character?.profiles?.full_name || 'Adventurer'}</span>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Your legend continues. Ready for today's challenges?</p>
        </div>
        <div className="flex items-center gap-3">
          <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 h-12 px-8 text-lg font-bold italic">
            <Link href="/adventure">
              <Play className="mr-2 h-5 w-5 fill-current" />
              ENTER THE ARENA
            </Link>
          </Button>
        </div>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Character Showcase & Pets */}
        <div className="lg:col-span-4 space-y-8">
          <CharacterShowcase 
            characterClass={character?.classes?.name} 
            level={character?.level} 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Total Coins</p>
                <div className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  <span className="text-xl font-black">{character?.coins || 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
              <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Day Streak</p>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="text-xl font-black">{streak?.current_streak || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Pet Card */}
          <Card className="relative overflow-hidden group border-primary/20 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Companion</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4 py-2">
              {petLoading ? (
                <Skeleton className="h-16 w-16 rounded-full" />
              ) : activePet ? (
                <>
                  <Avatar className="h-16 w-16 border-2 border-primary shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${activePet.pets.name}`} />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm">{activePet.pets.name}</h3>
                    <Badge variant="outline" className="text-[10px] h-4">{activePet.pets.rarity}</Badge>
                    <p className="text-[10px] text-primary font-bold mt-1">
                      {activePet.pets.buff_type} +{activePet.pets.buff_value}%
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">No active companion.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Progress, Heatmap, Quests */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Progress & Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 overflow-hidden border-primary/20 bg-card/50">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-end">
                  <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Level Progress</CardTitle>
                  <span className="text-xs font-bold text-primary">{character?.xp || 0} / {requiredExp} XP</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={expProgress} className="h-2" />
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-red-500" />
                    <span className="text-xs font-bold">{character?.hp || 100} HP</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-bold">{character?.mp || 50} MP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Vault', icon: Package, href: '/inventory', color: 'bg-blue-500/10 text-blue-500' },
                { label: 'Skills', icon: Sword, href: '/skills', color: 'bg-red-500/10 text-red-500' },
                { label: 'Hall', icon: Trophy, href: '/leaderboard', color: 'bg-yellow-500/10 text-yellow-500' },
                { label: 'Map', icon: MapIcon, href: '/adventure', color: 'bg-green-500/10 text-green-500' },
              ].map((btn) => (
                <Button key={btn.label} variant="outline" asChild className="h-full flex flex-col gap-1 rounded-xl hover:bg-accent border-primary/10 py-3">
                  <Link href={btn.href}>
                    <btn.icon className={cn("h-5 w-5", btn.color.split(' ')[1])} />
                    <span className="font-bold text-[10px] uppercase tracking-tighter">{btn.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Activity Heatmap */}
          {user && <ActivityHeatmap userId={user.id} />}

          {/* Daily Quests Component */}
          {user && <DailyQuests userId={user.id} />}

          {/* Recent Achievements Inline (Simpler version for dashboard) */}
          <Card className="border-primary/20 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Feats</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {achLoading ? (
                <Skeleton className="h-12 w-full" />
              ) : achievements?.map((ach: any) => (
                <div key={ach.id} className="flex items-center gap-2 shrink-0 bg-muted/30 p-2 rounded-lg border border-primary/5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    {ach.achievements.icon === 'Trophy' ? '🏆' : '🏅'}
                  </div>
                  <div className="max-w-[100px]">
                    <p className="text-[10px] font-bold truncate">{ach.achievements.name}</p>
                    <p className="text-[8px] text-muted-foreground uppercase">{new Date(ach.unlocked_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container py-8 space-y-8">
      <Skeleton className="h-16 w-1/3" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="col-span-2 h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
