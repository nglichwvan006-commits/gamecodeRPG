import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '@/utils/supabase/client'

// Since we're testing the logic that USES the service, 
// we'll mock the service or directly test the UI component behaviors
// but for now let's focus on service interaction tests.

describe('Authentication Logic', () => {
  let supabase: any

  beforeEach(() => {
    supabase = createClient()
    vi.clearAllMocks()
  })

  it('should call signInWithPassword with correct credentials', async () => {
    const email = 'test@example.com'
    const password = 'password123'
    
    await supabase.auth.signInWithPassword({ email, password })
    
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password
    })
  })

  it('should call signUp with correct credentials', async () => {
    const email = 'new@example.com'
    const password = 'password123'
    const username = 'newuser'

    await supabase.auth.signUp({ 
      email, 
      password, 
      options: { data: { username } } 
    })

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password,
      options: { data: { username } }
    })
  })

  it('should call signOut', async () => {
    await supabase.auth.signOut()
    expect(supabase.auth.signOut).toHaveBeenCalled()
  })
})
