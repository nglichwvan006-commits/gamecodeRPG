'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Moon, Sun, Sword, User, LogOut, Package, Heart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/use-auth-store'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { useRouter, usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const navItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Quests', href: '/problems' },
  { name: 'Inventory', href: '/inventory' },
  { name: 'Pets', href: '/pets' },
  { name: 'Adventure', href: '/adventure' },
  { name: 'Leaderboard', href: '/leaderboard' },
]

export function Navbar() {
  const { setTheme } = useTheme()
  const { user, isLoading } = useAuthStore()
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Signed out successfully')
      router.push('/')
      router.refresh()
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Sword className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
            </div>
            <span className="hidden sm:inline-block font-bold text-xl tracking-tight text-gradient">
              Code Adventure
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary rounded-full',
                  pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass">
                <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-primary/20 transition-all">
                      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.email || ''} />
                        <AvatarFallback className="bg-primary/5 text-primary">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 glass mt-2" align="end">
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex flex-col space-y-2">
                        <p className="text-base font-semibold leading-none text-gradient">
                          {user.user_metadata.username || 'Adventurer'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground font-mono">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/inventory" className="flex w-full items-center">
                          <Package className="mr-3 h-4 w-4 text-primary/70" />
                          <span>Inventory</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/pets" className="flex w-full items-center">
                          <Heart className="mr-3 h-4 w-4 text-primary/70" />
                          <span>Pets</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                        <Link href="/profile" className="flex w-full items-center">
                          <User className="mr-3 h-4 w-4 text-primary/70" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <DropdownMenuItem onClick={handleSignOut} className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" asChild className="rounded-full px-5 hover:bg-primary/5">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild className="rounded-full px-6 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t glass overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    pathname === item.href ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-3 border-t mt-2 pt-4">
                <span className="text-sm font-medium">Appearance</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setTheme('light')} className="rounded-full">Light</Button>
                  <Button variant="outline" size="sm" onClick={() => setTheme('dark')} className="rounded-full">Dark</Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
