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

export default function ItemsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  
  const queryClient = useQueryClient()

  const { data: items, isLoading } = useQuery({
    queryKey: ['admin-items'],
    queryFn: () => adminService.getItems()
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-items'] })
      toast.success('Item deleted')
    }
  })

  const filtered = items?.filter((i: any) => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Items</h1>
          <p className="text-muted-foreground">Manage gear, potions, and collectibles.</p>
        </div>
        <Button onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Item
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Loading...</TableCell></TableRow>
            ) : filtered?.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
                <TableCell>{item.price} coins</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setIsFormOpen(true); }}>
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
          <DialogHeader><DialogTitle>{selectedItem ? 'Edit' : 'Create'} Item</DialogTitle></DialogHeader>
          <ItemForm 
            initialData={selectedItem} 
            onSuccess={() => { setIsFormOpen(false); queryClient.invalidateQueries({ queryKey: ['admin-items'] }); }} 
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ItemForm({ initialData, onSuccess, onCancel }: any) {
  const form = useForm({
    defaultValues: initialData || { name: '', type: 'Weapon', description: '', price: 0, stats_boost: {} }
  })
  const mutation = useMutation({
    mutationFn: (data: any) => initialData ? adminService.updateItem(initialData.id, data) : adminService.createItem(data),
    onSuccess
  })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem><FormLabel>Type</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
        )} />
        <FormField control={form.control} name="price" render={({ field }) => (
          <FormItem><FormLabel>Price (Coins)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} /></FormControl></FormItem>
        )} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={mutation.isPending}>Save</Button>
        </div>
      </form>
    </Form>
  )
}
