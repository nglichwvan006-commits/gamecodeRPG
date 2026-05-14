import { create } from 'zustand'

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
}

interface AchievementNotificationState {
  queue: Achievement[]
  isShowing: boolean
  addAchievement: (achievement: Achievement) => void
  showNext: () => void
  hideCurrent: () => void
}

export const useAchievementNotificationStore = create<AchievementNotificationState>((set, get) => ({
  queue: [],
  isShowing: false,
  addAchievement: (achievement) => {
    set((state) => ({ queue: [...state.queue, achievement] }))
    if (!get().isShowing) {
      get().showNext()
    }
  },
  showNext: () => {
    const { queue } = get()
    if (queue.length > 0) {
      set({ isShowing: true })
    }
  },
  hideCurrent: () => {
    set((state) => ({ 
      isShowing: false,
      queue: state.queue.slice(1) 
    }))
    // Small delay before showing next
    setTimeout(() => {
      if (get().queue.length > 0) {
        get().showNext()
      }
    }, 500)
  },
}))
