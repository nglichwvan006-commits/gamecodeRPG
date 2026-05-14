import { createClient } from '@/utils/supabase/client'
import { UserPet, Pet } from '@/types/pet'

export const petService = {
  async getUserPets(userId: string): Promise<UserPet[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_pets')
      .select(`
        *,
        pet:pets (*)
      `)
      .eq('profile_id', userId)

    if (error) throw error
    return data as any[] as UserPet[]
  },

  async setActivePet(userId: string, userPetId: string) {
    const supabase = createClient()

    // 1. Deactivate all pets for this user
    await supabase
      .from('user_pets')
      .update({ is_active: false })
      .eq('profile_id', userId)

    // 2. Activate the selected pet
    const { error } = await supabase
      .from('user_pets')
      .update({ is_active: true })
      .eq('id', userPetId)
      .eq('profile_id', userId)

    if (error) throw error
  },

  async deactivatePet(userId: string, userPetId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('user_pets')
      .update({ is_active: false })
      .eq('id', userPetId)
      .eq('profile_id', userId)

    if (error) throw error
  }
}
