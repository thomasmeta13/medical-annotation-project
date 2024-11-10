'use client'

import * as React from "react"
import { Users, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMode } from "@/components/mode-provider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ModeToggle() {
  const { mode, setMode } = useMode()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMode(mode === "dev" ? "tasker" : "dev")}
          >
            {mode === "tasker" ? (
              <Code className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Users className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle mode</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch to {mode === "tasker" ? "developer" : "tasker"} mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
