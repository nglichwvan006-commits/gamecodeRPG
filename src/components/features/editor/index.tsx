import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

export const MonacoEditor = dynamic(
  () => import('./monaco-editor-impl'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-full w-full rounded-lg" />
  }
)
