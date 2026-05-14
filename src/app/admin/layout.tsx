import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Code2, 
  Trophy, 
  Backpack, 
  Cat, 
  Map as MapIcon, 
  History,
  Settings,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Problems', href: '/admin/problems', icon: Code2 },
    { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
    { label: 'Items', href: '/admin/items', icon: Backpack },
    { label: 'Pets', href: '/admin/pets', icon: Cat },
    { label: 'Zones', href: '/admin/zones', icon: MapIcon },
    { label: 'Submissions', href: '/admin/submissions', icon: History },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col fixed inset-y-0">
        <div className="p-6 border-b">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Settings className="w-5 h-5" />
            </div>
            <span>Admin Panel</span>
          </Link>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                {item.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t mt-auto">
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href="/dashboard">
              <LogOut className="w-4 h-4" />
              Exit Admin
            </Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="container py-8 px-4 md:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
