import { describe, it, expect, vi, beforeEach } from 'vitest'
import { inventoryService } from '@/services/inventory-service'
import { mockSupabase } from './setup'

describe('Inventory Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should unequip item', async () => {
    const userId = 'user-1'
    const userInventoryId = 'inv-1'
    
    // Using the default chainable mock from setup.ts
    mockSupabase.update.mockReturnValue(mockSupabase)
    mockSupabase.eq.mockReturnValue(mockSupabase)

    await inventoryService.unequipItem(userId, userInventoryId)
    
    expect(mockSupabase.from).toHaveBeenCalledWith('user_inventory')
    expect(mockSupabase.update).toHaveBeenCalledWith({ is_equipped: false })
  })

  it('should use potion and update character stats', async () => {
    const userId = 'user-1'
    const invId = 'inv-potion'
    const potion = { stats_boost: { hp: 20, mp: 10 } }
    
    // We need to reset mock values because usePotion does multiple different calls
    // But ensure the chain still works
    mockSupabase.single.mockResolvedValueOnce({ data: { hp: 50, mp: 50 } }) // select char
    mockSupabase.single.mockResolvedValueOnce({ data: { quantity: 1 } }) // select invItem

    await inventoryService.usePotion(userId, invId, potion as any)
    
    expect(mockSupabase.from).toHaveBeenCalledWith('characters')
    expect(mockSupabase.update).toHaveBeenCalledWith({ hp: 70, mp: 60 })
    expect(mockSupabase.from).toHaveBeenCalledWith('user_inventory')
    expect(mockSupabase.delete).toHaveBeenCalled()
  })
})
