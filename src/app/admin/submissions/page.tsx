'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/services/admin-service'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, Clock, Cpu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from 'date-fns'

export default function SubmissionsAdminPage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: submissions, isLoading } = useQuery({
    queryKey: ['admin-submissions'],
    queryFn: () => adminService.getAllSubmissions()
  })

  const filtered = submissions?.filter((s: any) => 
    s.profiles?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.problems?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Passed': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'Failed': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Submissions</h1>
        <p className="text-muted-foreground">Monitor real-time player activity and code results.</p>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search user or problem..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading submissions...
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">No submissions found.</TableCell>
              </TableRow>
            ) : (
              filtered?.map((sub: any) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.profiles?.username}</TableCell>
                  <TableCell>{sub.problems?.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(sub.status)}>
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {sub.execution_time?.toFixed(2)}ms
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> {sub.memory_used?.toFixed(2)}MB
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
