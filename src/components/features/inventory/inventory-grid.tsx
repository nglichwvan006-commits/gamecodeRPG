'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ArrowUpDown, X } from 'lucide-react'
import { UserInventoryItem } from '@/types/inventory'
import { ItemCard } from './item-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'

interface InventoryGridProps {
  items: UserInventoryItem[]
  onItemAction: (item: UserInventoryItem) => void
}

type SortOption = 'rarity-desc' | 'rarity-asc' | 'price-desc' | 'price-asc' | 'newest'

const RARITY_ORDER: Record<string, number> = {
  Common: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
  Mythic: 5
}

export function InventoryGrid({ items, onItemAction }: InventoryGridProps) {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('rarity-desc')

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items]

    // Filtering
    if (search) {
      result = result.filter(i => i.item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (filterType !== 'all') {
      result = result.filter(i => i.item.type === filterType)
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rarity-desc') return RARITY_ORDER[b.item.rarity] - RARITY_ORDER[a.item.rarity]
      if (sortBy === 'rarity-asc') return RARITY_ORDER[a.item.rarity] - RARITY_ORDER[b.item.rarity]
      if (sortBy === 'price-desc') return b.item.price - a.item.price
      if (sortBy === 'price-asc') return a.item.price - b.item.price
      return new Date((b as any).created_at || '').getTime() - new Date((a as any).created_at || '').getTime()
    })

    return result
  }, [items, search, filterType, sortBy])

  const categories = useMemo(() => {
    const types = new Set(items.map(i => i.item.type))
    return Array.from(types)
  }, [items])

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/30 border-primary/10 focus:border-primary/30"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Select value={filterType} onValueChange={(v) => setFilterType(v as string)}>
            <SelectTrigger className="w-[140px] bg-muted/30 border-primary/10">
              <Filter className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[180px] bg-muted/30 border-primary/10">
              <ArrowUpDown className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rarity-desc">Rarity (High to Low)</SelectItem>
              <SelectItem value="rarity-asc">Rarity (Low to High)</SelectItem>
              <SelectItem value="price-desc">Value (Expensive)</SelectItem>
              <SelectItem value="price-asc">Value (Cheap)</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="popLayout">
        {filteredAndSortedItems.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4"
          >
            {filteredAndSortedItems.map((userItem) => (
              <ItemCard 
                key={userItem.id} 
                userItem={userItem} 
                onAction={onItemAction}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center space-y-4"
          >
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Search className="h-10 w-10" />
            </div>
            <div>
              <p className="font-bold text-lg">No items found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
              <Button 
                variant="link" 
                onClick={() => { setSearch(''); setFilterType('all'); }}
                className="mt-2 text-primary"
              >
                Clear all filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
