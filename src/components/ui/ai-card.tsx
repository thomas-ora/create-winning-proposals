
import * as React from "react"
import { cn } from "@/lib/utils"

const AICard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    intelligent?: boolean;
  }
>(({ className, intelligent = false, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out",
        intelligent && [
          "ai-intelligent",
          "animate-ai-glow",
          "animate-border-luminance",
          "relative overflow-hidden"
        ],
        className
      )}
      {...props}
    >
      {intelligent && (
        <>
          {/* Neural Activity Lines */}
          <div className="ai-neural-lines top-4 left-4" style={{ animationDelay: '0s' }} />
          <div className="ai-neural-lines top-6 right-8" style={{ animationDelay: '1s' }} />
          <div className="ai-neural-lines bottom-8 left-12" style={{ animationDelay: '2s' }} />
          <div className="ai-neural-lines bottom-4 right-4" style={{ animationDelay: '3s' }} />
          
          {/* Intelligent Particles */}
          <div className="ai-particle top-8 left-16" style={{ animationDelay: '0s' }} />
          <div className="ai-particle top-16 right-12" style={{ animationDelay: '8s' }} />
          <div className="ai-particle bottom-12 left-8" style={{ animationDelay: '16s' }} />
          <div className="ai-particle bottom-20 right-20" style={{ animationDelay: '24s' }} />
        </>
      )}
      {children}
    </div>
  )
})
AICard.displayName = "AICard"

export { AICard }
