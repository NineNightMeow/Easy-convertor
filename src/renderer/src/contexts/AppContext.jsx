import React, { createContext, useState, useContext, useEffect } from 'react'
import zh_cn from '../locales/zh_cn'
import en from '../locales/en'
import ja from '../locales/ja' // ✅ 引入日文包

const AppContext = createContext()

const locales = {
  zh_cn,
  en,
  ja
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(localStorage.getItem('app_theme') || 'dark')
  const [lang, setLang] = useState(localStorage.getItem('app_lang') || 'zh_cn')
  const [globalOutputDir, setGlobalOutputDir] = useState(localStorage.getItem('app_output_dir') || '')

  // ✅ 动态获取语言包，默认回退到英文
  const t = locales[lang] || locales.en

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    if (theme === 'system') {
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(sys)
    } else {
      root.classList.add(theme)
    }
    localStorage.setItem('app_theme', theme)
  }, [theme])

  useEffect(() => localStorage.setItem('app_lang', lang), [lang])
  useEffect(() => localStorage.setItem('app_output_dir', globalOutputDir), [globalOutputDir])

  return (
    <AppContext.Provider value={{ theme, setTheme, lang, setLang, globalOutputDir, setGlobalOutputDir, t }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)