'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LayoutDashboard, BarChart2, Database, Users } from 'lucide-react'

interface NavItemWithHref {
  name: string;
  href: string;
  icon: any;
}

interface NavItemWithGetHref {
  name: string;
  getHref: (projectId: string) => string;
  icon: any;
}

type NavItem = NavItemWithHref | NavItemWithGetHref;

const navItems: NavItem[] = [
  { name: 'Projects', href: '/projects', icon: LayoutDashboard },
  { name: 'Evals', getHref: (projectId: string) => `/projects/${projectId}/evals`, icon: BarChart2 },
  { name: 'Data', getHref: (projectId: string) => `/projects/${projectId}/data`, icon: Database },
  { name: 'Team', getHref: (projectId: string) => `/projects/${projectId}/team`, icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname()
  const projectId = pathname.split('/')[2]

  return (
    <Sidebar className="border-r border-border bg-background">
      <SidebarHeader className="border-b border-border px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
            <span className="text-lg font-bold text-background">I</span>
          </div>
          <span className="text-xl font-semibold">Invoke</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-12">
        <SidebarMenu>
          {navItems.map((item) => {
            const href = 'getHref' in item ? item.getHref(projectId) : item.href
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === href}
                  className="flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
                >
                  <Link href={href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
