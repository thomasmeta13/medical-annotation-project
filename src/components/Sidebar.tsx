'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, FolderKanban, Users, Database, Target, Book, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSidebar } from './sidebar-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LucideIcon } from 'lucide-react'

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

interface NavButtonProps {
  href: string
  icon: LucideIcon
  label: string
  variant?: 'ghost' | 'default' | 'secondary'
  className?: string
  isCollapsed?: boolean
}

function NavButton({ href, icon: Icon, label, variant = 'ghost', className, isCollapsed = false }: NavButtonProps) {
  return isCollapsed ? (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <Button variant={variant} size="icon" className={cn("w-10 h-10", className)}>
              <Icon className="h-4 w-4" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Link href={href}>
      <Button variant={variant} className={cn("w-full justify-start", className)}>
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleCollapsed } = useSidebar()

  const getRouteInfo = () => {
    const parts = pathname.split('/')
    const projectId = parts[2]
    const taskId = parts[4]
    return { projectId, taskId }
  }

  const { projectId, taskId } = getRouteInfo()

  const renderNavigationButtons = () => {
    return (
      <div className={cn("space-y-4", isCollapsed && "space-y-2")}>
        <NavButton
          href="/projects"
          icon={FolderKanban}
          label="Projects"
          variant={!projectId ? 'secondary' : 'ghost'}
          isCollapsed={isCollapsed}
        />

        {projectId && (
          <div className={cn("space-y-1", isCollapsed && "space-y-2")}>
            <NavButton
              href={`/projects/${projectId}`}
              icon={FolderKanban}
              label={`Project ${projectId}`}
              isCollapsed={isCollapsed}
            />
            
            <div className={cn(isCollapsed ? "space-y-2" : "ml-4 space-y-1")}>
              {projectTasks.map((task) => (
                <div key={task.id}>
                  <NavButton
                    href={`/projects/${projectId}/tasks/${task.id}`}
                    icon={FileText}
                    label={task.name}
                    variant={taskId === task.id ? 'secondary' : 'ghost'}
                    isCollapsed={isCollapsed}
                  />
                  
                  {taskId === task.id && !isCollapsed && (
                    <div className="ml-4 space-y-1">
                      <NavButton
                        href={`/projects/${projectId}/tasks/${task.id}/evals`}
                        icon={Target}
                        label="Evals"
                        variant={pathname.includes('/evals') ? 'secondary' : 'ghost'}
                        isCollapsed={isCollapsed}
                      />
                      <NavButton
                        href={`/projects/${projectId}/tasks/${task.id}/data`}
                        icon={Database}
                        label="Data"
                        variant={pathname.includes('/data') ? 'secondary' : 'ghost'}
                        isCollapsed={isCollapsed}
                      />
                      <NavButton
                        href={`/projects/${projectId}/tasks/${task.id}/team`}
                        icon={Users}
                        label="Team"
                        variant={pathname.includes('/team') ? 'secondary' : 'ghost'}
                        isCollapsed={isCollapsed}
                      />
                      <NavButton
                        href={`/projects/${projectId}/tasks/${task.id}/instructions`}
                        icon={Book}
                        label="Instructions"
                        variant={pathname.includes('/instructions') ? 'secondary' : 'ghost'}
                        isCollapsed={isCollapsed}
                      />
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
    <div className={cn(
      "relative pb-12 border-r transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <SidebarHeader className={cn(
        "border-b border-border transition-all duration-300",
        isCollapsed ? "px-2" : "px-6",
        "py-4"
      )}>
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground shrink-0">
            <span className="text-lg font-bold text-background">I</span>
          </div>
          {!isCollapsed && <span className="text-xl font-semibold">Invoke</span>}
        </Link>
      </SidebarHeader>
      
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-[-12px] top-7 h-6 w-6 rounded-full border bg-background p-0 hover:bg-background"
        onClick={toggleCollapsed}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      <div className={cn("p-4", isCollapsed && "p-2")}>
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
