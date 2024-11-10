'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LayoutDashboard, ClipboardList } from 'lucide-react'

const navItems = [
  { name: 'Projects', href: '/tasker/projects', icon: LayoutDashboard },
  { name: 'My Tasks', href: '/tasker/tasks', icon: ClipboardList },
]

export function TaskerSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="border-b border-border px-6 py-4">
        <Link href="/tasker" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <span className="text-lg font-bold text-background">I</span>
          </div>
          <span className="text-xl font-semibold">Invoke Tasks</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-12">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === item.href}
                className="flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
} 