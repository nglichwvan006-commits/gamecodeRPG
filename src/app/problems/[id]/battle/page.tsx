'use client'

import { use, useState, useEffect, Suspense } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, Play, Send, Layout, Split, Maximize2, CheckCircle2, XCircle, Clock, Database, Loader2, Skull, Zap } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useSearchParams } from 'next/navigation'

import { cn } from '@/lib/utils'
import { problemService } from '@/services/problem-service'
import { submissionService, Judge0Result } from '@/services/submission-service'
import { rewardService } from '@/services/reward-service'
import { achievementService } from '@/services/achievement-service'
import { bossService, Boss } from '@/services/boss-service'
import { dailyQuestService } from '@/services/daily-quest-service'
import { useAuthStore } from '@/store/use-auth-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('@/components/features/editor').then(mod => mod.MonacoEditor), { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center bg-card"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div> })
const LevelUpModal = dynamic(() => import('@/components/shared/level-up-modal').then(mod => mod.LevelUpModal), { ssr: false })
const VictoryCinematic = dynamic(() => import('@/components/shared/victory-cinematic').then(mod => mod.VictoryCinematic), { ssr: false })

function BattleContent({ id }: { id: string }) {
  const searchParams = useSearchParams()
  const bossId = searchParams.get('bossId')
  const { user } = useAuthStore()
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('desc')
  
  // Level up & Boss state
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [levelUpData, setLevelUpData] = useState({ newLevel: 1, xp: 0, coins: 0 })
  const [boss, setBoss] = useState<Boss | null>(null)
  const [showVictory, setShowVictory] = useState(false)

  const { data: problem, isLoading } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => problemService.getProblemById(id),
  })

  useEffect(() => {
    if (bossId && user) {
      bossService.getBossesByMap('', user.id).then(bosses => {
        const found = bosses.find(b => b.id === bossId)
        if (found) setBoss(found)
      })
    }
  }, [bossId, user])

  const handleSubmit = async () => {
    if (!code) {
      toast.error('Please write some code first.')
      return
    }

    setIsSubmitting(true)
    setActiveTab('test')
    setTestResults([])

    try {
      const results = []
      let allPassed = true
      let totalTime = 0
      let maxMemory = 0

      for (const [index, testCase] of problem.test_cases.entries()) {
        const wrappedCode = `
          ${code}
          const input = ${JSON.stringify(testCase.input)};
          const result = ${problem.title.replace(/\s/g, '').toLowerCase().charAt(0) + problem.title.replace(/\s/g, '').slice(1).split(' ')[0]}(...input);
          process.stdout.write(JSON.stringify(result));
        `

        const token = await submissionService.executeCode(wrappedCode, 'javascript', '')
        const result = await submissionService.pollStatus(token)
        const passed = result.stdout?.trim() === JSON.stringify(testCase.expected)
        if (!passed) allPassed = false
        totalTime += parseFloat(result.time || '0')
        maxMemory = Math.max(maxMemory, result.memory || 0)

        results.push({ ...result, passed, expected: testCase.expected })
      }

      setTestResults(results)
      const finalStatus = allPassed ? 'Passed' : 'Failed'
      await rewardService.recordSubmission(user!.id, id, code, finalStatus, totalTime, maxMemory)

      if (allPassed) {
        // Update Daily Quest progress for solving a problem
        await dailyQuestService.updateProgress(user!.id, 'solve_problems', 1)

        if (boss) {
          await bossService.recordDefeat(user!.id, boss.id)
          // Update Daily Quest progress for defeating a boss
          await dailyQuestService.updateProgress(user!.id, 'defeat_boss', 1)
          
          // Actually award the boss rewards
          await rewardService.awardCustomRewards(user!.id, boss.reward_pool.xp, boss.reward_pool.coins)
          
          setShowVictory(true)
        } else {
          const reward = await rewardService.awardPlayer(user!.id, problem.difficulty, problem.points)
          if (reward.leveledUp) {
            setLevelUpData({ newLevel: reward.newLevel, xp: reward.xpGained, coins: reward.coinsGained })
            setShowLevelUp(true)
          } else {
            toast.success(`Quest Completed! Gained ${reward.xpGained} XP and ${reward.coinsGained} Coins.`)
          }
        }
        await achievementService.checkAndUnlockAchievements(user!.id)
      } else {
        toast.error('Some test cases failed. Try again!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Error during submission.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <BattleSkeleton />
  if (!problem) return <div>Problem not found.</div>

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
      {showVictory && boss && (
        <VictoryCinematic 
          bossName={boss.name} 
          rewards={{ xp: boss.reward_pool.xp, coins: boss.reward_pool.coins }} 
          onClose={() => setShowVictory(false)}
        />
      )}
      <LevelUpModal 
        isOpen={showLevelUp} 
        onClose={() => setShowLevelUp(false)} 
        newLevel={levelUpData.newLevel}
        rewards={{ xp: levelUpData.xp, coins: levelUpData.coins }}
      />
      
      <div className="flex items-center justify-between px-6 py-2 border-b bg-card">
        <div className="flex items-center gap-4">
          <Link href={`/adventure`} className="hover:bg-muted p-1 rounded-md transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            {boss && <Skull className="h-4 w-4 text-red-500 animate-pulse" />}
            <h1 className="font-bold text-sm">{boss ? `BOSS: ${boss.name}` : problem.title}</h1>
            <Badge variant={boss ? "destructive" : "outline"} className="text-[10px]">{boss ? "EPIC" : problem.difficulty}</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
            Run Tests
          </Button>
          <Button size="sm" className={cn("shadow-lg shadow-primary/20", boss ? "bg-red-600 hover:bg-red-700" : "bg-primary")} onClick={handleSubmit} disabled={isSubmitting}>
            <Send className="mr-2 h-4 w-4" />
            {boss ? 'Defeat Boss' : 'Submit Solution'}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 border-r flex flex-col bg-card/50">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-10 px-4">
              <TabsTrigger value="desc" className="text-xs">Description</TabsTrigger>
              <TabsTrigger value="test" className="text-xs">Test Cases & Results</TabsTrigger>
            </TabsList>
            <TabsContent value="desc" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full p-6">
                <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                  {boss && (
                    <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/20 mb-4">
                      <h4 className="text-red-500 font-black uppercase flex items-center gap-2 m-0">
                        <Skull className="h-4 w-4" /> Warning: Boss Battle
                      </h4>
                      <p className="text-xs m-0 pt-1 font-medium italic">"{boss.description}"</p>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{problem.description}</p>
                  
                  <div className="space-y-4 pt-4">
                    <h4 className="font-bold flex items-center gap-2 text-sm">
                      <Layout className="h-4 w-4" /> Examples
                    </h4>
                    {problem.test_cases?.slice(0, 2).map((tc: any, i: number) => (
                      <div key={i} className="space-y-2 p-3 rounded-lg bg-muted/50 border">
                        <p className="text-[10px] font-bold uppercase opacity-50 text-muted-foreground">Input</p>
                        <code className="text-xs font-mono">{JSON.stringify(tc.input)}</code>
                        <p className="text-[10px] font-bold uppercase opacity-50 pt-2 text-muted-foreground">Output</p>
                        <code className="text-xs font-mono text-primary">{JSON.stringify(tc.expected)}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="test" className="flex-1 m-0 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 p-6">
                {isSubmitting ? (
                  <div className="flex flex-col items-center justify-center h-40 space-y-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium animate-pulse">Computing solution matrix...</p>
                  </div>
                ) : testResults.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Test Results</h3>
                      <Badge variant={testResults.every(r => r.passed) ? 'default' : 'destructive'} className="uppercase">
                        {testResults.every(r => r.passed) ? 'All Passed' : 'Failed'}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      {testResults.map((result, i) => (
                        <div key={i} className={cn(
                          "p-4 rounded-xl border transition-all",
                          result.passed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
                        )}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase">Case {i + 1}</span>
                            {result.passed ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                          </div>
                          <div className="space-y-1 text-[11px] font-mono">
                            <p><span className="opacity-50">Expected:</span> {JSON.stringify(result.expected)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-60 text-center space-y-4">
                    <Zap className="h-8 w-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Run tests to see outcomes.</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          <MonacoEditor 
            problemId={id} 
            initialCode={problem.initial_code || ''} 
            onChange={(val) => setCode(val || '')}
          />
        </div>
      </div>
    </div>
  )
}

export default function CodeBattlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <Suspense fallback={<BattleSkeleton />}>
      <BattleContent id={id} />
    </Suspense>
  )
}

function BattleSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <Skeleton className="h-12 w-full rounded-none" />
      <div className="flex-1 flex">
        <Skeleton className="w-1/3 h-full rounded-none border-r" />
        <Skeleton className="flex-1 h-full rounded-none" />
      </div>
    </div>
  )
}
