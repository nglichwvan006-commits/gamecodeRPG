'use client'

import { useEffect, useState } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { 
  Settings, 
  RotateCcw, 
  Type, 
  Keyboard, 
  Save,
  Check
} from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface CodeEditorProps {
  problemId: string
  initialCode?: string
  language?: string
  onChange?: (value: string | undefined) => void
}

const LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'C++', value: 'cpp' },
  { label: 'C#', value: 'csharp' },
  { label: 'Java', value: 'java' },
]

export default function MonacoEditorImpl({
  problemId,
  initialCode = '',
  language = 'javascript',
  onChange,
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [code, setCode] = useState(initialCode)
  const [fontSize, setFontSize] = useState(14)
  const [currentLanguage, setCurrentLanguage] = useState(language)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const savedCode = localStorage.getItem(`code-draft-${problemId}`)
    if (savedCode) {
      setCode(savedCode)
      onChange?.(savedCode)
    }
  }, [problemId, onChange])

  // Auto-save logic
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(`code-draft-${problemId}`, code)
    }, 1000)
    return () => clearTimeout(timeout)
  }, [code, problemId])

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '')
    onChange?.(value)
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset your code to the initial state?')) {
      setCode(initialCode)
      localStorage.removeItem(`code-draft-${problemId}`)
      toast.info('Code reset to initial state')
    }
  }

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      localStorage.setItem(`code-draft-${problemId}`, editor.getValue())
      toast.success('Draft saved manually')
    })
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-card">
      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Select value={currentLanguage} onValueChange={(val) => setCurrentLanguage(val as string)}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 border-l pl-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFontSize(Math.max(10, fontSize - 1))}>
              <span className="text-[10px]">A-</span>
            </Button>
            <span className="text-[10px] font-bold w-4 text-center">{fontSize}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setFontSize(Math.min(30, fontSize + 1))}>
              <span className="text-[10px]">A+</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset} title="Reset Code">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex justify-between items-center">
                <span>Vim Mode</span>
                <Badge variant="outline" className="text-[10px]">Soon</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-between items-center">
                <span>Minimap</span>
                <Check className="h-3 w-3" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 min-h-[400px]">
        <Editor
          height="100%"
          language={currentLanguage}
          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 16, bottom: 16 },
            fontFamily: 'var(--font-geist-mono)',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Footer / Status Bar */}
      <div className="px-4 py-1 border-t bg-muted/30 flex justify-between items-center text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
        <div className="flex gap-4">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
        </div>
        <div className="flex items-center gap-1">
          <Save className="h-3 w-3" />
          <span>Auto-saving draft...</span>
        </div>
      </div>
    </div>
  )
}
