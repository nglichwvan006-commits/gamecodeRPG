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
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
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
  FormLabel 
} from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ZonesAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState<any>(null)
  
  const queryClient = useQueryClient()

  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ['admin-zones'],
    queryFn: () => adminService.getZones()
  })

  const { data: maps } = useQuery({
    queryKey: ['admin-maps'],
    queryFn: () => adminService.getMaps()
  })

  const { data: problems } = useQuery({
    queryKey: ['admin-problems-list'],
    queryFn: () => adminService.getProblems()
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteZone(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-zones'] })
      toast.success('Zone deleted')
    }
  })

  const filtered = zones?.filter((z: any) => 
    z.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zones</h1>
          <p className="text-muted-foreground">Manage adventure locations and encounters.</p>
        </div>
        <Button onClick={() => { setSelectedZone(null); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Zone
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search zones..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Map</TableHead>
              <TableHead>Zone Name</TableHead>
              <TableHead>Enemy</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zonesLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : filtered?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell><Badge variant="outline">{item.maps?.name || 'Unknown'}</Badge></TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.enemy_type}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedZone(item); setIsFormOpen(true); }}>
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
          <DialogHeader><DialogTitle>{selectedZone ? 'Edit' : 'Create'} Zone</DialogTitle></DialogHeader>
          <ZoneForm 
            initialData={selectedZone}
            maps={maps}
            problems={problems}
            onSuccess={() => { setIsFormOpen(false); queryClient.invalidateQueries({ queryKey: ['admin-zones'] }); }} 
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ZoneForm({ initialData, maps, problems, onSuccess, onCancel }: any) {
  const form = useForm({
    defaultValues: initialData || { map_id: '', name: '', description: '', enemy_type: '', problem_id: null }
  })
  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? adminService.updateZone(initialData.id, data) : adminService.createZone(data),
    onSuccess
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField control={form.control} name="map_id" render={({ field }) => (
          <FormItem><FormLabel>Map</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select Map" /></SelectTrigger></FormControl>
              <SelectContent>
                {maps?.map((m: any) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Zone Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="enemy_type" render={({ field }) => (
          <FormItem><FormLabel>Enemy Type</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="problem_id" render={({ field }) => (
          <FormItem><FormLabel>Linked Problem</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
              <FormControl><SelectTrigger><SelectValue placeholder="Select Problem" /></SelectTrigger></FormControl>
              <SelectContent>
                {problems?.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormItem>
        )} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Form>
  )
}
