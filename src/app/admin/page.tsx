import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Code2, 
  Trophy, 
  Backpack, 
  Cat, 
  Map as MapIcon, 
  History,
  Users
} from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

async function getStats() {
  const supabase = await createClient()
  
  const [
    { count: problemsCount },
    { count: achievementsCount },
    { count: itemsCount },
    { count: petsCount },
    { count: submissionsCount },
    { count: usersCount }
  ] = await Promise.all([
    supabase.from('problems').select('*', { count: 'exact', head: true }),
    supabase.from('achievements').select('*', { count: 'exact', head: true }),
    supabase.from('inventory_items').select('*', { count: 'exact', head: true }),
    supabase.from('pets').select('*', { count: 'exact', head: true }),
    supabase.from('submissions').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  return {
    problems: problemsCount || 0,
    achievements: achievementsCount || 0,
    items: itemsCount || 0,
    pets: petsCount || 0,
    submissions: submissionsCount || 0,
    users: usersCount || 0,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    { title: 'Total Problems', value: stats.problems, icon: Code2, color: 'text-blue-500' },
    { title: 'Achievements', value: stats.achievements, icon: Trophy, color: 'text-yellow-500' },
    { title: 'Inventory Items', value: stats.items, icon: Backpack, color: 'text-green-500' },
    { title: 'Pets', value: stats.pets, icon: Cat, color: 'text-pink-500' },
    { title: 'Submissions', value: stats.submissions, icon: History, color: 'text-purple-500' },
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-orange-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your game ecosystem.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* TODO: Recent Submissions or Activity Chart */}
    </div>
  )
}
