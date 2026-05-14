'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Info, Trophy, Heart, Zap } from 'lucide-react'
import { toast } from 'sonner'

import { petService } from '@/services/pet-service'
import { useAuthStore } from '@/store/use-auth-store'
import { PetCard } from '@/components/features/pets/pet-card'
import { UserPet } from '@/types/pet'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function PetsPage() {
  const { user } = useAuthStore()
  const queryClient = useQueryClient()

  const { data: userPets, isLoading } = useQuery({
    queryKey: ['user-pets', user?.id],
    queryFn: () => petService.getUserPets(user!.id),
    enabled: !!user,
  })

  const activateMutation = useMutation({
    mutationFn: (userPetId: string) => petService.setActivePet(user!.id, userPetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-pets', user?.id] })
      toast.success('New companion activated!')
    },
    onError: (error: any) => toast.error(error.message)
  })

  const deactivateMutation = useMutation({
    mutationFn: (userPetId: string) => petService.deactivatePet(user!.id, userPetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-pets', user?.id] })
      toast.success('Companion sent to rest.')
    },
    onError: (error: any) => toast.error(error.message)
  })

  const handleToggleActive = (userPet: UserPet) => {
    if (userPet.is_active) {
      deactivateMutation.mutate(userPet.id)
    } else {
      activateMutation.mutate(userPet.id)
    }
  }

  if (isLoading) return <PetsSkeleton />

  const activePet = userPets?.find(p => p.is_active)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Your Companions</h1>
            <p className="text-muted-foreground font-medium uppercase text-xs tracking-[0.3em]">
              Loyal pets that boost your coding journey
            </p>
          </div>
          <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-2xl border">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase opacity-50">Active Bonus</p>
              <p className="text-sm font-bold text-primary">
                {activePet ? `+${activePet.pet.buff_value}% ${activePet.pet.buff_type.replace('_boost', '')}` : 'No Active Buff'}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Hero Alert for Active Pet */}
        <AnimatePresence mode="wait">
          {activePet ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert className="bg-primary/5 border-primary/20 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Heart className="h-10 w-10 animate-pulse" />
                </div>
                <div className="flex-1 space-y-1 text-center md:text-left">
                  <AlertTitle className="text-xl font-black uppercase tracking-tight">
                    {activePet.pet.name} is currently following you!
                  </AlertTitle>
                  <AlertDescription className="text-sm font-medium opacity-80 italic">
                    {activePet.pet.description} Your {activePet.pet.buff_type.replace('_boost', '')} is boosted by {activePet.pet.buff_value}%.
                  </AlertDescription>
                </div>
              </Alert>
            </motion.div>
          ) : (
            <motion.div
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Alert variant="destructive" className="bg-destructive/5 border-destructive/20 p-6">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-bold">No companion active</AlertTitle>
                <AlertDescription className="text-xs">
                  Choose a pet from your collection to receive their powerful coding buffs!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userPets && userPets.length > 0 ? (
            userPets.map((userPet) => (
              <PetCard 
                key={userPet.id} 
                userPet={userPet} 
                onToggleActive={handleToggleActive} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed rounded-3xl opacity-50">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <Trophy className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase">No Pets Found</h3>
                <p className="text-sm">Complete legendary quests to find mysterious companions!</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function PetsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-12 w-48" />
      </div>
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-3xl" />
        ))}
      </div>
    </div>
  )
}
