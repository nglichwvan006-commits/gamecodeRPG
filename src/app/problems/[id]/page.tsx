'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Brain, Zap, Trophy, ChevronLeft, Play, Info, AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { problemService } from '@/services/problem-service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data: problem, isLoading } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => problemService.getProblemById(id),
  })

  if (isLoading) return <ProblemDetailSkeleton />
  if (!problem) return <div>Problem not found.</div>

  return (
    <div className="container py-10 space-y-8">
      <Link href="/problems" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
        <ChevronLeft className="h-4 w-4" />
        Back to Quests
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Content */}
        <div className="lg:col-span-8 flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-black tracking-tight">{problem.title}</h1>
              <Badge variant="outline" className="px-3 py-1 font-bold">
                {problem.difficulty}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                {problem.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                <Zap className="h-4 w-4" />
                {problem.xp_reward} XP
              </div>
              <div className="flex items-center gap-1 text-sm font-bold text-primary">
                <Trophy className="h-4 w-4" />
                {problem.points} Points
              </div>
            </div>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="examples">Examples & Constraints</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed whitespace-pre-wrap">{problem.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples" className="mt-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Sample Test Cases
                </h3>
                {problem.test_cases?.map((testCase: any, i: number) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Input</p>
                      <pre className="p-4 rounded-lg bg-secondary font-mono text-sm overflow-x-auto">
                        {JSON.stringify(testCase.input, null, 2)}
                      </pre>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-muted-foreground">Expected Output</p>
                      <pre className="p-4 rounded-lg bg-primary/10 border border-primary/20 font-mono text-sm overflow-x-auto">
                        {JSON.stringify(testCase.expected, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>

              {problem.constraints && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Constraints
                  </h3>
                  <Card className="bg-red-500/5 border-red-500/10">
                    <CardContent className="p-4 font-mono text-sm whitespace-pre-wrap">
                      {problem.constraints}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: Sidebar */}
        <div className="lg:w-[350px] space-y-6">
          <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
            <div className="h-2 bg-primary" />
            <CardHeader>
              <CardTitle>Ready to Battle?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                Your selected class will grant you special abilities during this challenge.
              </p>
              <Button asChild className="w-full h-12 text-lg shadow-lg shadow-primary/20">
                <Link href={`/problems/${id}/battle`}>
                  <Play className="mr-2 h-5 w-5 fill-current" />
                  Enter Battle
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Tags</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {problem.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ProblemDetailSkeleton() {
  return (
    <div className="container py-10 space-y-8">
      <Skeleton className="h-4 w-32" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="lg:w-[350px] space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}
