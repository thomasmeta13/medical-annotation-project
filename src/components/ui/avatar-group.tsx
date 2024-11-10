import * as React from "react"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const AvatarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }
>(({ className, children, ...props }, ref) => {
  const avatars = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Avatar
  )

  return (
    <div
      ref={ref}
      className={cn("flex -space-x-4 overflow-hidden", className)}
      {...props}
    >
      {avatars}
    </div>
  )
})
AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }