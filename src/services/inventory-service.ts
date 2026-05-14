import { createClient } from '@/utils/supabase/client'
import { UserInventoryItem, InventoryItem } from '@/types/inventory'

export const inventoryService = {
  async getUserInventory(userId: string): Promise<UserInventoryItem[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_inventory')
      .select(`
        *,
        item:inventory_items (*)
      `)
      .eq('profile_id', userId)

    if (error) throw error
    return data as any[] as UserInventoryItem[]
  },

  async equipItem(userId: string, userInventoryId: string, itemType: string) {
    const supabase = createClient()

    // 1. Unequip existing item of the same type
    // First find items of the same type that are equipped
    const { data: equippedItems } = await supabase
      .from('user_inventory')
      .select(`
        id,
        item:inventory_items (type)
      `)
      .eq('profile_id', userId)
      .eq('is_equipped', true)
    
    const sameTypeEquipped = equippedItems?.filter(ui => (ui.item as any).type === itemType)

    if (sameTypeEquipped && sameTypeEquipped.length > 0) {
      const { error: unequipError } = await supabase
        .from('user_inventory')
        .update({ is_equipped: false })
        .in('id', sameTypeEquipped.map(i => i.id))
      
      if (unequipError) throw unequipError
    }

    // 2. Equip the new item
    const { error: equipError } = await supabase
      .from('user_inventory')
      .update({ is_equipped: true })
      .eq('id', userInventoryId)
      .eq('profile_id', userId)

    if (equipError) throw equipError
  },

  async unequipItem(userId: string, userInventoryId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('user_inventory')
      .update({ is_equipped: false })
      .eq('id', userInventoryId)
      .eq('profile_id', userId)

    if (error) throw error
  },

  async usePotion(userId: string, userInventoryId: string, item: InventoryItem) {
    const supabase = createClient()

    // 1. Get character
    const { data: character } = await supabase
      .from('characters')
      .select('hp, mp')
      .eq('profile_id', userId)
      .single()

    if (!character) throw new Error('Character not found')

    // 2. Apply effects
    const newHp = Math.min(100, character.hp + (item.stats_boost.hp || 0)) // Max HP should be dynamic but using 100 for now
    const newMp = Math.min(100, character.mp + (item.stats_boost.mp || 0))

    await supabase
      .from('characters')
      .update({ hp: newHp, mp: newMp })
      .eq('profile_id', userId)

    // 3. Reduce quantity or delete
    const { data: invItem } = await supabase
      .from('user_inventory')
      .select('quantity')
      .eq('id', userInventoryId)
      .single()
    
    if (invItem && invItem.quantity > 1) {
      await supabase
        .from('user_inventory')
        .update({ quantity: invItem.quantity - 1 })
        .eq('id', userInventoryId)
    } else {
      await supabase
        .from('user_inventory')
        .delete()
        .eq('id', userInventoryId)
    }
  }
}
