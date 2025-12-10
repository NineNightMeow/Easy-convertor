import React, { useState } from 'react'
import { Clapperboard, Music, Image as ImageIcon, Settings, ChevronRight } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import appIcon from '../../icon/icon.ico'

export default function Sidebar({ activePage, setPage }) {
  const { t } = useApp()
  const [isHovered, setIsHovered] = useState(false)
  const sidebarWidth = isHovered ? 'w-[260px]' : 'w-[88px]'

  const NavItem = ({ id, icon: Icon, label, desc, isBottom }) => {
    const isActive = activePage === id
    return (
      <button
        onClick={() => setPage(id)}
        className={`
          relative flex items-center 
          px-4 py-3.5 mx-3 rounded-2xl transition-all duration-300 group overflow-hidden
          ${isBottom ? 'mt-auto mb-4' : 'mb-2'} 
          ${isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5'}
        `}
      >
        <div className="w-6 h-6 flex items-center justify-center shrink-0 mx-auto">
          <Icon className={`w-6 h-6 transition-transform duration-300 ${isHovered ? 'scale-100' : 'scale-110'}`} />
        </div>

        <div className={`flex flex-col items-start ml-4 whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-4 w-0 absolute pointer-events-none'}`}>
          <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-white' : 'text-zinc-700 dark:text-zinc-200'}`}>
            {label}
          </span>
          {desc && isHovered && (
            <span className={`text-[10px] ${isActive ? 'text-blue-100' : 'text-zinc-400'}`}>
              {desc}
            </span>
          )}
        </div>

        {isActive && isHovered && (
          <ChevronRight className="w-4 h-4 ml-auto text-white/50" />
        )}
      </button>
    )
  }

  return (
    <div
      className={`${sidebarWidth} h-full flex flex-col bg-white dark:bg-[#121212] border-r border-zinc-200 dark:border-white/5 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] z-40 relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-24 flex items-center justify-center draggable select-none relative overflow-hidden shrink-0">
        <div className={`transition-all duration-500 flex items-center gap-3 ${isHovered ? 'w-full px-6' : 'w-auto'}`}>
          <img
            src={appIcon}
            alt="Logo"
            className="w-10 h-10 rounded-xl shadow-lg shrink-0 object-cover"
          />
          <div className={`flex flex-col transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 absolute pointer-events-none'}`}>
            <h1 className="font-black text-xl text-zinc-800 dark:text-white leading-none">Easy<span className="text-blue-500">Convert</span></h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-x-hidden py-2">
        <NavItem id="video" icon={Clapperboard} label={t.nav.video} desc="MP4, MKV..." />
        <NavItem id="audio" icon={Music} label={t.nav.audio} desc="MP3, FLAC..." />
        <NavItem id="image" icon={ImageIcon} label={t.nav.image} desc="JPG, PNG..." />

        <div className="mt-auto">
          <NavItem id="settings" icon={Settings} label={t.nav.settings} desc="Preferences" />
        </div>
      </div>
    </div>
  )
}