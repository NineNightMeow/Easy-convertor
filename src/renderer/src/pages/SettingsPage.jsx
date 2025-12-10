import React from 'react'
import { useApp } from '../contexts/AppContext'
import { Github, Folder, Monitor, Moon, Sun, Cpu, Layout, FileCode, Coffee, Info } from 'lucide-react'
import appIcon from '../icon/icon.ico'

export default function SettingsPage() {
  const { theme, setTheme, lang, setLang, globalOutputDir, setGlobalOutputDir, t } = useApp()

  const handleSelectDir = async () => {
    if (window.api) {
      const path = await window.api.selectFolder()
      if (path) setGlobalOutputDir(path)
    }
  }

  const Card = ({ title, children }) => (
    <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-2xl p-6 mb-6 shadow-sm transition-colors">
      <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-5 flex items-center gap-2">{title}</h3>
      {children}
    </div>
  )

  const InfoRow = ({ label, value, copyable = false }) => (
    <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-white/5 last:border-0">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className={`text-xs font-medium text-zinc-700 dark:text-zinc-300 font-mono ${copyable ? 'select-text cursor-text hover:text-blue-500' : ''}`}>
        {value}
      </span>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto animate-fade-in pb-20">
      <h2 className="text-3xl font-bold text-zinc-800 dark:text-white mb-8">{t.settings.title}</h2>

      {/* 1. 常规设置 */}
      <Card title={t.settings.general}>
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.settings.lang}</span>
          <select
            value={lang} onChange={e => setLang(e.target.value)}
            className="bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="zh_cn">🇨🇳 简体中文</option>
            <option value="en">🇺🇸 English</option>
            <option value="ja">🇯🇵 日本語</option>
          </select>
        </div>
        <div className="pt-6 border-t border-zinc-100 dark:border-white/5">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block mb-2">{t.settings.output}</span>
          <div className="flex gap-2">
            <div className="flex-1 bg-zinc-50 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center overflow-hidden select-all">
              <span className="truncate">{globalOutputDir || 'Default (Documents/EasyConverter/output)'}</span>
            </div>
            <button onClick={handleSelectDir} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
              <Folder className="w-3.5 h-3.5" /> {t.common.selectDir}
            </button>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" /> {t.settings.outputTip}
          </p>
        </div>
      </Card>

      {/* 主题设置 */}
      <Card title={t.settings.theme}>
        <div className="grid grid-cols-3 gap-4">
          {[{ id: 'light', icon: Sun }, { id: 'dark', icon: Moon }, { id: 'system', icon: Monitor }].map(({ id, icon: Icon }) => (
            <button key={id} onClick={() => setTheme(id)} className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all ${theme === id ? 'border-blue-600 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'border-transparent bg-zinc-50 dark:bg-black/20 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5'}`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs font-bold capitalize">{id}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card title={t.settings.about}>
        <div className="flex gap-6 items-start mb-6">
          <img src={appIcon} alt="Logo" className="w-16 h-16 rounded-2xl shadow-lg object-cover" />
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">EasyConverter Pro</h3>
            <p className="text-xs text-zinc-500 font-mono mt-1">v1.2.0 (Beta)</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md leading-relaxed">
              一个现代化、高性能的本地媒体格式转换工具。<br />
              无需上传，保护隐私，完全开源。
            </p>
          </div>
        </div>

        {/*项目信息列表 */}
        <div className="bg-zinc-50 dark:bg-black/20 rounded-xl p-4 border border-zinc-100 dark:border-white/5 mb-6">
          <InfoRow label="Build Version" value="1.0.0" />
          <InfoRow label="Author" value="KuriNatuski&Hapy" />
          <InfoRow label="Build Date" value="2025-12-09" />
          <InfoRow label="License" value="MIT License" />
          <InfoRow label="Repository" value="https://github.com/NineNightMeow/Easy-convertor" copyable />
        </div>

        {/*技术栈*/}
        <div className="mb-6">
          <div className="text-[10px] font-bold text-zinc-400 mb-3 uppercase tracking-wider pl-1">Technology Stack</div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: 'Electron', icon: Cpu, color: 'text-blue-500' },
              { name: 'React', icon: Layout, color: 'text-cyan-500' },
              { name: 'Tailwind', icon: FileCode, color: 'text-teal-500' },
              { name: 'FFmpeg', icon: Monitor, color: 'text-emerald-500' },
            ].map((item) => (
              <div key={item.name} className="bg-zinc-50 dark:bg-white/5 p-3 rounded-xl flex flex-col items-center justify-center gap-2 border border-zinc-100 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-default group">
                <item.icon className={`w-5 h-5 ${item.color} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`} />
                <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/*底部链接 */}
        <div className="flex gap-3">
          <a href="https://github.com/NineNightMeow/Easy-convertor" target="_blank" rel="noreferrer" className="flex-1 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Github className="w-4 h-4" /> GitHub Project
          </a>
        </div>
      </Card>
    </div>
  )
}