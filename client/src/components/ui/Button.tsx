import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
  iconOnly?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "outline", size = "md", iconOnly, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 font-bold tracking-widest uppercase transition-all duration-200 active:scale-[.97] cursor-pointer rounded-lg border outline-none",
          size === "sm" && "text-[.7rem] h-7 px-3",
          size === "md" && "text-[.78rem] h-9 px-4",
          size === "lg" && "text-[.82rem] h-11 px-6",
          iconOnly && "!px-0 w-9 h-9",
          variant === "primary" && "text-white border-violet-500 bg-gradient-to-br from-violet-600 to-violet-800 [box-shadow:0_0_16px_rgba(124,58,237,.5),0_0_40px_rgba(124,58,237,.2),inset_0_1px_0_rgba(255,255,255,.1)] hover:from-violet-500 hover:to-violet-700 hover:[box-shadow:0_0_24px_rgba(139,92,246,.7),0_0_60px_rgba(139,92,246,.3)]",
          variant === "outline" && "bg-transparent text-violet-400 border-violet-500/40 [box-shadow:0_0_10px_rgba(124,58,237,.15),inset_0_0_10px_rgba(124,58,237,.05)] hover:border-violet-500/80 hover:text-violet-300 hover:[box-shadow:0_0_18px_rgba(124,58,237,.35)]",
          variant === "ghost" && "bg-transparent text-zinc-600 border-[#1e1e2e] hover:text-violet-400 hover:border-[#2a2a3e]",
          variant === "danger" && "bg-[#3d1515] text-red-400 border-[#5a1f1f] [box-shadow:0_0_10px_rgba(239,68,68,.1)] hover:bg-[#4d1f1f] hover:[box-shadow:0_0_16px_rgba(239,68,68,.2)]",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export default Button