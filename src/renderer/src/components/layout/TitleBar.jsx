import React from 'react'
import { Minus, Square, X } from 'lucide-react'

export default function TitleBar() {
  const handleControl = (action) => {
    if (window.api && window.api[action]) {
      window.api[action]()
    }
  }

  return (
    <div className="absolute top-0 right-0 z-50 flex no-drag">
      <button 
        onClick={() => handleControl('minimize')}
        className="h-8 w-10 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button 
        onClick={() => handleControl('maximize')}
        className="h-8 w-10 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors"
      >
        <Square className="w-3 h-3" />
      </button>
      <button 
        onClick={() => handleControl('close')}
        className="h-8 w-10 flex items-center justify-center text-zinc-500 hover:bg-red-500 hover:text-white transition-colors rounded-tr-lg" // 假设窗口有圆角
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}