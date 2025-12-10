import React from 'react'

export default function Button({ children, onClick, disabled, className = "", variant = "default" }) {
  const baseStyle = "px-3 py-1.5 text-xs font-medium transition-all duration-200 border rounded-sm no-drag flex items-center justify-center gap-2 active:scale-95"
  
  const variants = {
    default: "bg-[#0A0A0A] border-[#333] text-zinc-400 hover:text-zinc-100 hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed",
    primary: "bg-zinc-100 border-zinc-100 text-black hover:bg-zinc-300 hover:border-zinc-300",
    danger: "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20 hover:border-red-500/50",
    ghost: "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-[#111]"
  }

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}