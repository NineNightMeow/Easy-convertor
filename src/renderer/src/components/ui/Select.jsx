import React from 'react'
import { ChevronDown } from 'lucide-react'

export default function Select({ value, onChange, options, icon: Icon }) {
  return (
    <div className="relative group no-drag w-full">
      {Icon && <Icon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors pointer-events-none" />}
      
      <select 
        value={value}
        onChange={onChange}
        className={`
          w-full appearance-none bg-[#0A0A0A] border border-[#333] text-xs text-zinc-400 
          py-2 pr-8 rounded-sm outline-none transition-colors cursor-pointer
          hover:border-zinc-500 hover:text-zinc-200 focus:border-zinc-400
          ${Icon ? 'pl-8' : 'pl-3'}
        `}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 pointer-events-none" />
    </div>
  )
}