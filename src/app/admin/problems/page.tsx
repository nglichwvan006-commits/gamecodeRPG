'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/services/admin-service'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  Loader2,
  ExternalLink
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import Link from 'next/link'

export default function ProblemsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedProblem, setSelectedProblem] = useState<any>(null)
  
  const queryClient = useQueryClient()

  const { data: problems, isLoading } = useQuery({
    queryKey: ['admin-problems'],
    queryFn: () => adminService.getProblems()
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProblem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-problems'] })
      toast.success('Problem deleted successfully')
    },
    onError: (error) => {
      toast.error('Failed to delete problem: ' + error.message)
    }
  })

  const filteredProblems = problems?.filter((p: any) => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (problem: any) => {
    setSelectedProblem(problem)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this problem?')) {
      deleteMutation.mutate(id)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'Medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'Hard': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'Epic': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
          <p className="text-muted-foreground">Manage coding challenges and test cases.</p>
        </div>
        <Button onClick={() => { setSelectedProblem(null); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Problem
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search problems..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Points/XP</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading problems...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProblems?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No problems found.
                </TableCell>
              </TableRow>
            ) : (
              filteredProblems?.map((problem: any) => (
                <TableRow key={problem.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {problem.title}
                      <Link href={`/problems/${problem.id}`} target="_blank">
                        <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{problem.category || 'General'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-yellow-600 font-bold">{problem.points}pts</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="text-blue-600 font-bold">{problem.xp_reward}xp</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(problem)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(problem.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Problem Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProblem ? 'Edit Problem' : 'Create New Problem'}</DialogTitle>
          </DialogHeader>
          {/* Form component will be here */}
          <div className="py-4">
             <ProblemForm 
              initialData={selectedProblem} 
              onSuccess={() => {
                setIsFormOpen(false)
                queryClient.invalidateQueries({ queryKey: ['admin-problems'] })
              }}
              onCancel={() => setIsFormOpen(false)}
             />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Sub-component for the form
import { useForm } from 'react-hook-form'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

function ProblemForm({ initialData, onSuccess, onCancel }: any) {
  const form = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      difficulty: 'Easy',
      points: 10,
      xp_reward: 50,
      category: 'General',
      tags: [],
      constraints: '',
      test_cases: [
        { input: '', expected: '' }
      ],
      initial_code: ''
    }
  })

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (initialData) {
        return adminService.updateProblem(initialData.id, data)
      }
      return adminService.createProblem(data)
    },
    onSuccess: () => {
      toast.success(initialData ? 'Problem updated' : 'Problem created')
      onSuccess()
    },
    onError: (error: any) => {
      toast.error('Error: ' + error.message)
    }
  })

  const onSubmit = (data: any) => {
    // Process tags if they are a string
    if (typeof data.tags === 'string') {
      try {
        data.tags = JSON.parse(data.tags)
      } catch {
        data.tags = data.tags.split(',').map((t: string) => t.trim())
      }
    }
    
    // Process test_cases if they are a string
    if (typeof data.test_cases === 'string') {
      try {
        data.test_cases = JSON.parse(data.test_cases)
      } catch {
        // Keep as is or handle error
      }
    }

    mutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea rows={5} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points</FormLabel>
                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="xp_reward"
            render={({ field }) => (
              <FormItem>
                <FormLabel>XP Reward</FormLabel>
                <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="constraints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Constraints</FormLabel>
              <FormControl><Textarea {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="initial_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Code</FormLabel>
              <FormControl><Textarea className="font-mono" rows={6} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="test_cases"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Test Cases (JSON)</FormLabel>
              <FormDescription>Format: Array of objects with input and expected fields.</FormDescription>
              <FormControl>
                <Textarea 
                  className="font-mono text-xs" 
                  rows={8} 
                  value={typeof field.value === 'string' ? field.value : JSON.stringify(field.value, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      field.onChange(parsed)
                    } catch {
                      field.onChange(e.target.value)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialData ? 'Update Problem' : 'Create Problem'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
