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
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export default function AchievementsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  
  const queryClient = useQueryClient()

  const { data: achievements, isLoading } = useQuery({
    queryKey: ['admin-achievements'],
    queryFn: () => adminService.getAchievements()
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteAchievement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-achievements'] })
      toast.success('Achievement deleted')
    }
  })

  const filtered = achievements?.filter((a: any) => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">Define milestones for players.</p>
        </div>
        <Button onClick={() => { setSelectedAchievement(null); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Achievement
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Icon</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : filtered?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell><div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">{item.icon}</div></TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.condition_type}: {item.condition_value}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedAchievement(item); setIsFormOpen(true); }}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedAchievement ? 'Edit' : 'Create'} Achievement</DialogTitle></DialogHeader>
          <AchievementForm 
            initialData={selectedAchievement} 
            onSuccess={() => { setIsFormOpen(false); queryClient.invalidateQueries({ queryKey: ['admin-achievements'] }); }} 
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AchievementForm({ initialData, onSuccess, onCancel }: any) {
  const form = useForm({
    defaultValues: initialData || { name: '', description: '', icon: '🏆', condition_type: '', condition_value: 0 }
  })
  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? adminService.updateAchievement(initialData.id, data) : adminService.createAchievement(data),
    onSuccess
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="icon" render={({ field }) => (
            <FormItem><FormLabel>Icon (Emoji/URL)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="condition_type" render={({ field }) => (
            <FormItem><FormLabel>Condition Type</FormLabel><FormControl><Input placeholder="e.g. problems_solved" {...field} /></FormControl></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="condition_value" render={({ field }) => (
          <FormItem><FormLabel>Condition Value</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
        )} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Form>
  )
}
