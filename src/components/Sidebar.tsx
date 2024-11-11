'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, FolderKanban, Users, Database, Target, Book } from 'lucide-react'

interface SidebarHeaderProps {
  className?: string
  children: React.ReactNode
}

function SidebarHeader({ className, children }: SidebarHeaderProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Mock data for tasks - replace with real data fetching
const projectTasks = [
  { id: "1", name: "Task 1" },
  { id: "2", name: "Task 2" },
  { id: "3", name: "Task 3" },
]

export function AppSidebar() {
  const pathname = usePathname()

  const getRouteInfo = () => {
    const parts = pathname.split('/')
    const projectId = parts[2]
    const taskId = parts[4]
    return { projectId, taskId }
  }

  const { projectId, taskId } = getRouteInfo()

  const renderNavigationButtons = () => {
    return (
      <div className="space-y-4">
        <Link href="/projects">
          <Button variant={!projectId ? 'secondary' : 'ghost'} className="w-full justify-start">
            <FolderKanban className="mr-2 h-4 w-4" />
            Projects
          </Button>
        </Link>

        {projectId && (
          <div className="space-y-1">
            <Link href={`/projects/${projectId}`}>
              <Button variant="ghost" className="w-full justify-start font-semibold">
                <FolderKanban className="mr-2 h-4 w-4" />
                Project {projectId}
              </Button>
            </Link>
            
            <div className="ml-4 space-y-1">
              {projectTasks.map((task) => (
                <div key={task.id}>
                  <Link href={`/projects/${projectId}/tasks/${task.id}`}>
                    <Button 
                      variant={taskId === task.id ? 'secondary' : 'ghost'} 
                      className="w-full justify-start"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {task.name}
                    </Button>
                  </Link>
                  
                  {taskId === task.id && (
                    <div className="ml-4 space-y-1">
                      <Link href={`/projects/${projectId}/tasks/${task.id}/evals`}>
                        <Button variant={pathname.includes('/evals') ? 'secondary' : 'ghost'} className="w-full justify-start">
                          <Target className="mr-2 h-4 w-4" />
                          Evals
                        </Button>
                      </Link>
                      <Link href={`/projects/${projectId}/tasks/${task.id}/data`}>
                        <Button variant={pathname.includes('/data') ? 'secondary' : 'ghost'} className="w-full justify-start">
                          <Database className="mr-2 h-4 w-4" />
                          Data
                        </Button>
                      </Link>
                      <Link href={`/projects/${projectId}/tasks/${task.id}/team`}>
                        <Button variant={pathname.includes('/team') ? 'secondary' : 'ghost'} className="w-full justify-start">
                          <Users className="mr-2 h-4 w-4" />
                          Team
                        </Button>
                      </Link>
                      <Link href={`/projects/${projectId}/tasks/${task.id}/instructions`}>
                        <Button variant={pathname.includes('/instructions') ? 'secondary' : 'ghost'} className="w-full justify-start">
                          <Book className="mr-2 h-4 w-4" />
                          Instructions
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("pb-12 w-64 shrink-0 border-r")}>
      <SidebarHeader className="border-b border-border px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <span className="text-lg font-bold text-background">I</span>
          </div>
          <span className="text-xl font-semibold">Invoke</span>
        </Link>
      </SidebarHeader>
      <div className="p-4">
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {renderNavigationButtons()}
        </ScrollArea>
      </div>
    </div>
  )
}

export function TaskerSidebar() {
  return <AppSidebar />
}
