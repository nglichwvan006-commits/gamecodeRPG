'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Sword, Shield, Zap, Sparkles, Heart, Activity } from 'lucide-react'
import { toast } from 'sonner'

import { inventoryService } from '@/services/inventory-service'
import { characterService } from '@/services/character-service'
import { useAuthStore } from '@/store/use-auth-store'
import { InventoryGrid } from '@/components/features/inventory/inventory-grid'
import { UserInventoryItem } from '@/types/inventory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export default function InventoryPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: character, isLoading: charLoading } = useQuery({
    queryKey: ['character', user?.id],
    queryFn: () => characterService.getCharacterData(user!.id),
    enabled: !!user,
  })

  const { data: inventory, isLoading: invLoading } = useQuery({
    queryKey: ['inventory', user?.id],
    queryFn: () => inventoryService.getUserInventory(user!.id),
    enabled: !!user,
  })

  const equipMutation = useMutation({
    mutationFn: ({ id, type }: { id: string, type: string }) => 
      inventoryService.equipItem(user!.id, id, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['character', user?.id] })
      toast.success('Item equipped successfully!')
    },
    onError: (error: any) => toast.error(error.message)
  })

  const unequipMutation = useMutation({
    mutationFn: (id: string) => inventoryService.unequipItem(user!.id, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['character', user?.id] })
      toast.success('Item unequipped.')
    },
    onError: (error: any) => toast.error(error.message)
  })

  const usePotionMutation = useMutation({
    mutationFn: (userItem: UserInventoryItem) => 
      inventoryService.usePotion(user!.id, userItem.id, userItem.item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['character', user?.id] })
      toast.success('Potion used!')
    },
    onError: (error: any) => toast.error(error.message)
  })

  const handleItemAction = (userItem: UserInventoryItem) => {
    if (userItem.item.type === 'Potion') {
      usePotionMutation.mutate(userItem)
    } else if (userItem.is_equipped) {
      unequipMutation.mutate(userItem.id)
    } else {
      equipMutation.mutate({ id: userItem.id, type: userItem.item.type })
    }
  }

  if (invLoading || charLoading) return <InventorySkeleton />

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Character Stats & Preview */}
        <div className="lg:w-1/3 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/10 shadow-xl shadow-primary/5">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-primary" />
                Character Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                  <span className="text-4xl font-black">Lvl {character?.level}</span>
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-tight uppercase">Hero Stats</h2>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Master Coder</p>
                </div>
              </div>

              <div className="space-y-4">
                <StatBar label="Health Points" value={character?.hp} max={100} icon={Heart} color="bg-red-500" />
                <StatBar label="Mana Points" value={character?.mp} max={100} icon={Zap} color="bg-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="bg-secondary/50 p-3 rounded-xl border flex items-center gap-3">
                  <Sword className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground leading-none">Attack</p>
                    <p className="text-lg font-black">{10 + (inventory?.filter(i => i.is_equipped).reduce((acc, curr) => acc + (curr.item.stats_boost.attack || 0), 0) || 0)}</p>
                  </div>
                </div>
                <div className="bg-secondary/50 p-3 rounded-xl border flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground leading-none">Defense</p>
                    <p className="text-lg font-black">{5 + (inventory?.filter(i => i.is_equipped).reduce((acc, curr) => acc + (curr.item.stats_boost.defense || 0), 0) || 0)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Equipped Summary */}
          <Card className="border-2 border-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Equipment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {['Weapon', 'Armor', 'Accessory'].map(type => {
                const equipped = inventory?.find(i => i.is_equipped && i.item.type === type)
                return (
                  <div key={type} className="flex justify-between items-center p-2 rounded-lg bg-muted/30 border border-dashed">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">{type}</span>
                    <span className="text-xs font-bold text-primary">{equipped?.item.name || '---'}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Inventory Grid */}
        <div className="lg:w-2/3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight uppercase">Your Inventory</h1>
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
              {inventory?.length || 0} Slots Used
            </div>
          </div>
          
          <InventoryGrid 
            items={inventory || []} 
            onItemAction={handleItemAction} 
          />
        </div>

      </div>
    </div>
  )
}

function StatBar({ label, value, max, icon: Icon, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
        <span className="flex items-center gap-1.5">
          <Icon className="h-3 w-3" />
          {label}
        </span>
        <span>{value} / {max}</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  )
}

function InventorySkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <Skeleton className="lg:w-1/3 h-[500px] rounded-2xl" />
        <div className="lg:w-2/3 space-y-6">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
