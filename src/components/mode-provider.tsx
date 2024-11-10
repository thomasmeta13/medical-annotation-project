"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, FileText, Users, Settings, ClipboardList } from 'lucide-react'

type Mode = "dev" | "tasker"

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

const devNavItems: NavItem[] = [
  { name: "Projects", href: "/projects", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: ClipboardList },
  { name: "Data", href: "/data", icon: FileText },
  { name: "Team", href: "/team", icon: Users },
  { name: "Settings", href: "/settings", icon: Settings },
]

const taskerNavItems: NavItem[] = [
  { name: "Projects", href: "/tasker/projects", icon: LayoutDashboard },
  { name: "My Tasks", href: "/tasker/tasks", icon: ClipboardList },
]

interface ModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  navItems: NavItem[];
}

const ModeContext = React.createContext<ModeContextType | null>(null)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mode, setMode] = React.useState<Mode>(
    pathname.startsWith("/tasker") ? "tasker" : "dev"
  )

  const navItems = mode === "tasker" ? taskerNavItems : devNavItems

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    if (newMode === "tasker") {
      router.push("/tasker/projects")
    } else {
      router.push("/projects")
    }
  }

  return (
    <ModeContext.Provider value={{ mode, setMode: handleModeChange, navItems }}>
      {children}
    </ModeContext.Provider>
  )
}

export const useMode = () => {
  const context = React.useContext(ModeContext)
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider")
  }
  return context
}
