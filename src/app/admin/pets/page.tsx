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

export default function PetsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<any>(null)
  
  const queryClient = useQueryClient()

  const { data: pets, isLoading } = useQuery({
    queryKey: ['admin-pets'],
    queryFn: () => adminService.getPets()
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pets'] })
      toast.success('Pet deleted')
    }
  })

  const filtered = pets?.filter((p: any) => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-slate-500'
      case 'Rare': return 'bg-blue-500'
      case 'Epic': return 'bg-purple-500'
      case 'Legendary': return 'bg-orange-500'
      default: return 'bg-slate-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pets</h1>
          <p className="text-muted-foreground">Manage companion animals and their buffs.</p>
        </div>
        <Button onClick={() => { setSelectedPet(null); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Pet
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search pets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rarity</TableHead>
              <TableHead>Buff</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : filtered?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell><Badge className={getRarityColor(item.rarity)}>{item.rarity}</Badge></TableCell>
                <TableCell>{item.buff_type}: +{item.buff_value}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedPet(item); setIsFormOpen(true); }}>
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
          <DialogHeader><DialogTitle>{selectedPet ? 'Edit' : 'Create'} Pet</DialogTitle></DialogHeader>
          <PetForm 
            initialData={selectedPet} 
            onSuccess={() => { setIsFormOpen(false); queryClient.invalidateQueries({ queryKey: ['admin-pets'] }); }} 
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PetForm({ initialData, onSuccess, onCancel }: any) {
  const form = useForm({
    defaultValues: initialData || { name: '', description: '', buff_type: 'Attack', buff_value: 0, rarity: 'Common' }
  })
  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? adminService.updatePet(initialData.id, data) : adminService.createPet(data),
    onSuccess
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="rarity" render={({ field }) => (
          <FormItem><FormLabel>Rarity</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
              <SelectContent>
                <SelectItem value="Common">Common</SelectItem>
                <SelectItem value="Rare">Rare</SelectItem>
                <SelectItem value="Epic">Epic</SelectItem>
                <SelectItem value="Legendary">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="buff_type" render={({ field }) => (
            <FormItem><FormLabel>Buff Type</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="buff_value" render={({ field }) => (
            <FormItem><FormLabel>Buff Value</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl></FormItem>
          )} />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Form>
  )
}
