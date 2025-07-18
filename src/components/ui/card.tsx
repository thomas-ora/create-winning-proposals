import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    intelligent?: boolean;
  }
>(({ className, intelligent = false, children, ...props }, ref) => {
  if (intelligent) {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out",
          "ai-intelligent animate-ai-glow animate-border-luminance relative overflow-hidden",
          className
        )}
        {...props}
      >
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
        
        {children}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
