import { createClient } from '@/utils/supabase/client'

export const adminService = {
  // Check if current user is admin
  async isAdmin(userId: string): Promise<boolean> {
    const supabase = createClient()
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()
    
    return data?.role === 'admin'
  },

  // Problems CRUD
  async getProblems() {
    const supabase = createClient()
    const { data, error } = await supabase.from('problems').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async createProblem(problem: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('problems').insert(problem).select().single()
    if (error) throw error
    return data
  },
  async updateProblem(id: string, updates: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('problems').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteProblem(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('problems').delete().eq('id', id)
    if (error) throw error
  },

  // Achievements CRUD
  async getAchievements() {
    const supabase = createClient()
    const { data, error } = await supabase.from('achievements').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async createAchievement(achievement: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('achievements').insert(achievement).select().single()
    if (error) throw error
    return data
  },
  async updateAchievement(id: string, updates: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('achievements').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteAchievement(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('achievements').delete().eq('id', id)
    if (error) throw error
  },

  // Items CRUD
  async getItems() {
    const supabase = createClient()
    const { data, error } = await supabase.from('inventory_items').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async createItem(item: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('inventory_items').insert(item).select().single()
    if (error) throw error
    return data
  },
  async updateItem(id: string, updates: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('inventory_items').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteItem(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('inventory_items').delete().eq('id', id)
    if (error) throw error
  },

  // Pets CRUD
  async getPets() {
    const supabase = createClient()
    const { data, error } = await supabase.from('pets').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async createPet(pet: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('pets').insert(pet).select().single()
    if (error) throw error
    return data
  },
  async updatePet(id: string, updates: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('pets').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deletePet(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('pets').delete().eq('id', id)
    if (error) throw error
  },

  // Zones CRUD
  async getZones() {
    const supabase = createClient()
    const { data, error } = await supabase.from('zones').select('*, maps(name)').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },
  async createZone(zone: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('zones').insert(zone).select().single()
    if (error) throw error
    return data
  },
  async updateZone(id: string, updates: any) {
    const supabase = createClient()
    const { data, error } = await supabase.from('zones').update(updates).eq('id', id).select().single()
    if (error) throw error
    return data
  },
  async deleteZone(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('zones').delete().eq('id', id)
    if (error) throw error
  },

  // Submissions View
  async getAllSubmissions(limit: number = 100) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('submissions')
      .select('*, profiles(username), problems(title)')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Maps (for Zone creation)
  async getMaps() {
    const supabase = createClient()
    const { data, error } = await supabase.from('maps').select('*').order('name')
    if (error) throw error
    return data
  }
}
