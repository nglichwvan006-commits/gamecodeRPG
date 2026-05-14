'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useAuthStore } from '@/store/use-auth-store'
import { streakService } from '@/services/streak-service'
import { toast } from 'sonner'

export function AuthInitializer() {
  const { setUser, setIsLoading } = useAuthStore()
  const supabase = createClient()
  const recordedRef = useRef(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        
        const user = session?.user ?? null
        setUser(user)

        if (user && !recordedRef.current) {
          recordedRef.current = true
          const result = await streakService.recordActivity(user.id)
          if (result.milestoneReached) {
            toast.success(`Amazing! You've reached a ${result.current} day streak! 🏆`, {
              description: "You're becoming a legendary coder!"
            })
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      setUser(user)
      setIsLoading(false)

      if (user && !recordedRef.current) {
        recordedRef.current = true
        await streakService.recordActivity(user.id)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setIsLoading, supabase.auth])

  return null
}
