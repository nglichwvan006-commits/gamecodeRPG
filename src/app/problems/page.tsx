'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, Filter, Sword, Brain, Zap, Trophy, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { problemService } from '@/services/problem-service'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const difficultyColors: Record<string, string> = {
  Easy: 'bg-green-500/10 text-green-500 border-green-500/20',
  Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  Hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  Epic: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

export default function ProblemsPage() {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('all')
  const [category, setCategory] = useState('all')

  const { data: problems, isLoading } = useQuery({
    queryKey: ['problems', { search, difficulty, category }],
    queryFn: () => problemService.getProblems({ search, difficulty, category }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => problemService.getCategories(),
  })

  return (
    <div className="container py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Coding Quests</h1>
          <p className="text-muted-foreground">Select a challenge to sharpen your skills and earn rewards.</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card/50 backdrop-blur">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search quests..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={difficulty} onValueChange={(val) => setDifficulty(val as string)}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(val) => setCategory(val as string)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Problems List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))
        ) : problems && problems.length > 0 ? (
          problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/problems/${problem.id}`}>
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden relative">
                  <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1",
                    problem.difficulty === 'Easy' ? 'bg-green-500' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-500' :
                    problem.difficulty === 'Hard' ? 'bg-red-500' : 'bg-purple-500'
                  )} />
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex h-12 w-12 rounded-xl bg-secondary items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{problem.title}</h3>
                          <Badge variant="outline" className={cn("text-[10px] uppercase font-bold", difficultyColors[problem.difficulty])}>
                            {problem.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            {problem.xp_reward} XP
                          </span>
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3 text-primary" />
                            {problem.points} Points
                          </span>
                          <span className="hidden sm:inline-block">•</span>
                          <span className="hidden sm:inline-block capitalize">{problem.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1">
                        {problem.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] hidden md:flex">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No quests found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
