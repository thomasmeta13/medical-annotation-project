'use client'

import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar, TaskerSidebar } from '@/components/Sidebar'
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/ThemeToggle"
import { ModeToggle } from "@/components/ModeToggle"
import { Toaster } from "@/components/ui/toaster"
import { ModeProvider, useMode } from "@/components/mode-provider"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const { mode } = useMode()

  return (
    <div className="flex h-screen bg-background">
      {mode === "tasker" ? <TaskerSidebar /> : <AppSidebar />}
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-[calc(100vw-16rem)]">
        <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex-1 flex items-center justify-between px-4">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <ModeToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ModeProvider>
            <SidebarProvider>
              <RootLayoutContent>{children}</RootLayoutContent>
            </SidebarProvider>
          </ModeProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}