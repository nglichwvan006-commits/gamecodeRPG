'use client'

import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Compass, Trophy, Map as MapIcon, Sparkles } from 'lucide-react'
import { mapService } from '@/services/map-service'
import { useAuthStore } from '@/store/use-auth-store'
import { MapNode } from '@/components/features/adventure/map-node'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function AdventurePage() {
  const { user } = useAuthStore()

  const { data: worldMap, isLoading } = useQuery({
    queryKey: ['world-map', user?.id],
    queryFn: () => mapService.getWorldMapData(user!.id),
    enabled: !!user,
  })

  if (isLoading) return <AdventureSkeleton />

  const totalCompletion = worldMap 
    ? Math.round(worldMap.reduce((acc, curr) => acc + curr.completion_percentage, 0) / worldMap.length) 
    : 0

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-background overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -left-20 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-40 -right-20 w-[500px] h-[500px] bg-primary/3 blur-[120px] rounded-full" 
        />
      </div>

      <ScrollArea className="h-full relative z-10">
        <div className="container mx-auto px-4 py-12">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
                <Compass className="h-4 w-4" />
                World Explorer
              </div>
              <h1 className="text-5xl font-black tracking-tighter uppercase italic">Codelandia Map</h1>
              <p className="text-muted-foreground text-sm font-medium max-w-lg">
                Your journey through the realms of logic and algorithms. Conquer each zone to become the Ultimate Developer.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-card/50 backdrop-blur border-2 border-primary/10 p-4 rounded-2xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60 leading-none">Global Progress</p>
                  <p className="text-2xl font-black">{totalCompletion}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Path */}
          <div className="relative py-12 px-4 space-y-0">
            {/* Visual Path Connector (SVG for a more organic feel) */}
            <svg className="absolute left-1/2 -translate-x-1/2 top-0 w-full h-full pointer-events-none opacity-20" preserveAspectRatio="none">
              {/* This is a simple vertical line, but could be an organic path */}
              <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="currentColor" strokeWidth="4" strokeDasharray="12 12" className="text-primary" />
            </svg>

            {worldMap?.map((map, index) => (
              <MapNode key={map.id} map={map} index={index} />
            ))}

            {/* Final Goal / Boss Preview */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-20 text-center space-y-6"
            >
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary/40 border-4 border-dashed border-primary/20">
                  <Sparkles className="h-16 w-16" />
                </div>
                <div className="absolute inset-0 animate-ping rounded-full border-2 border-primary/20" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase opacity-40">The Final Challenge</h3>
                <p className="text-sm text-muted-foreground italic">Unlock all territories to face the Spaghetti Monster.</p>
              </div>
            </motion.div>
          </div>

        </div>
      </ScrollArea>
    </div>
  )
}

function AdventureSkeleton() {
  return (
    <div className="container py-12 space-y-12">
      <div className="flex justify-between">
        <div className="space-y-4">
          <Skeleton className="h-12 w-96" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-20 w-48 rounded-2xl" />
      </div>
      <div className="space-y-20 pt-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-10">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="flex-1 h-48 rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  )
}
