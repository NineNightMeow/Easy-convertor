import React, { useState, useRef } from 'react'
import { AppProvider } from './contexts/AppContext.jsx'
import Sidebar from './components/layout/Sidebar.jsx'
import TitleBar from './components/layout/TitleBar.jsx'
import ScrollProgress from './components/ui/ScrollProgress.jsx'
import VideoPage from './pages/VideoPage.jsx'
import AudioPage from './pages/AudioPage.jsx'
import ImagePage from './pages/ImagePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import './assets/css/main.css'

function MainLayout() {
  const [page, setPage] = useState('video')
  const contentRef = useRef(null)

  const handlePageChange = (newPage) => {
    setPage(newPage)
    contentRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-[#090909] text-zinc-900 dark:text-white overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-8 draggable z-50" />
      <TitleBar /> 

      <Sidebar activePage={page} setPage={handlePageChange} />
      
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        
        <div ref={contentRef} className="flex-1 p-8 pt-12 overflow-y-auto scrollbar-hide">
          {page === 'video' && <VideoPage />}
          {page === 'audio' && <AudioPage />}
          {page === 'image' && <ImagePage />}
          {page === 'settings' && <SettingsPage />}
        </div>

        <ScrollProgress targetRef={contentRef} />
        
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  )
}