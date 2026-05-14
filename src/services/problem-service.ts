import { createClient } from '@/utils/supabase/client'

export interface ProblemFilter {
  difficulty?: string
  category?: string
  search?: string
}

export const problemService = {
  async getProblems(filters: ProblemFilter = {}) {
    const supabase = createClient()
    let query = supabase.from('problems').select('*')

    if (filters.difficulty && filters.difficulty !== 'all') {
      query = query.eq('difficulty', filters.difficulty)
    }

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getProblemById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getCategories() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('problems')
      .select('category')
    
    if (error) throw error
    
    // Unique categories
    const categories = Array.from(new Set(data.map(p => p.category)))
    return categories
  }
}
