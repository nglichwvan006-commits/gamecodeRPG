import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Create a stable mock instance
const mockSupabase: any = {
  auth: {
    getSession: vi.fn(),
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  },
}

// Chainable methods
const chainable = [
  'from', 'select', 'insert', 'update', 'delete', 
  'eq', 'in', 'order', 'limit', 'single', 'maybeSingle'
]

chainable.forEach(method => {
  mockSupabase[method] = vi.fn().mockImplementation(() => mockSupabase)
})

// Mock Supabase client
vi.mock('@/utils/supabase/client', () => ({
  createClient: () => mockSupabase,
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  redirect: vi.fn(),
}))

export { mockSupabase }
