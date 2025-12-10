import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollProgress({ targetRef }) {
  const [percent, setPercent] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el
      const total = scrollHeight - clientHeight
      // 防止除以0
      const p = total > 0 ? Math.round((scrollTop / total) * 100) : 0
      
      setPercent(p)
      setVisible(scrollTop > 50) 
    }

    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [targetRef])

  const scrollToTop = () => {
    targetRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const radius = 18
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div 
      // 🚀【核心修改】把 absolute 改成 fixed，并调高 z-index
      className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 transform ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <button 
        onClick={scrollToTop}
        className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-[#222] shadow-xl hover:shadow-2xl transition-all border border-zinc-100 dark:border-zinc-800 hover:scale-110 active:scale-95"
      >
        <svg className="absolute w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius} fill="none" strokeWidth="3" className="stroke-zinc-100 dark:stroke-white/5" />
          <circle 
            cx="22" cy="22" r={radius} fill="none" strokeWidth="3" 
            strokeDasharray={circumference} 
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="stroke-blue-500 transition-all duration-300 ease-out"
          />
        </svg>

        <div className="relative z-10 flex items-center justify-center w-full h-full">
           <ArrowUp className="w-5 h-5 text-zinc-600 dark:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity absolute" />
           <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400 group-hover:opacity-0 transition-opacity absolute select-none">
             {percent}
           </span>
        </div>
      </button>
    </div>
  )
}