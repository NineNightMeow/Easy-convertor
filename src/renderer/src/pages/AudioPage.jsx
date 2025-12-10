import React, { useState, useRef, useEffect } from 'react'
import { Upload, Music, Play, Trash2, Plus, StopCircle, FolderOpen } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm h-full transition-colors">
    {title && <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">{title}</h3>}
    {children}
  </div>
)

export default function AudioPage() {
  const { t, globalOutputDir } = useApp()
  const [tasks, setTasks] = useState([])
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef(null)
  
  const [config, setConfig] = useState({ format: 'mp3', audioBitrate: '192k', channels: '2' , trimStart: '', trimEnd: '' })

  useEffect(() => {
    if (!window.api) return
    const updateTask = (id, data) => setTasks(p => p.map(t => t.id === id ? { ...t, ...data } : t))
    const removeP = window.api.onProgress(({ id, progress }) => updateTask(id, { status: 'processing', progress }))
    const removeC = window.api.onComplete(({ id, path }) => { updateTask(id, { status: 'done', progress: 100, resultPath: path }); setIsConverting(false) })
    const removeE = window.api.onError(({ id }) => { updateTask(id, { status: 'error' }); setIsConverting(false) })
    return () => { removeP(); removeC(); removeE() }
  }, [])

  const addFiles = (files) => {
    if (files?.length) {
      const newTasks = Array.from(files).map(f => ({
        id: Math.random().toString(36).slice(2), name: f.name, path: window.api?.getFilePath ? window.api.getFilePath(f) : f.path, status: 'pending', progress: 0
      }))
      setTasks(p => [...p, ...newTasks])
    }
  }

  const toggleConvert = () => {
    if (isConverting) { setIsConverting(false); return }
    setIsConverting(true)
    tasks.filter(t => t.status === 'pending').forEach(task => {
        setTasks(p => p.map(t => t.id === task.id ? { ...t, status: 'processing' } : t))
        window.api.convert({ id: task.id, filePath: task.path, type: 'audio', config: { ...config, outputDir: globalOutputDir } })
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-black text-zinc-800 dark:text-white mb-1 transition-colors">{t.nav.audio}</h2>
           <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">{t.audio.formats}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors"><Plus className="w-5 h-5"/> {t.common.add}</button>
          <button onClick={toggleConvert} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg text-white transition-all active:scale-95 ${isConverting ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-600 hover:bg-pink-700'}`}>
            {isConverting ? <><StopCircle className="w-5 h-5 fill-current"/> {t.common.stop}</> : <><Play className="w-5 h-5 fill-current"/> {t.common.start}</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();addFiles(e.dataTransfer.files)}} className="min-h-[420px] bg-zinc-50 dark:bg-[#121212] border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:border-pink-500 relative cursor-default">
            <input type="file" multiple ref={fileInputRef} className="hidden" accept="audio/*" onChange={e => addFiles(e.target.files)} />
            {tasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 pointer-events-none"><div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6"><Music className="w-10 h-10 opacity-50"/></div><span className="font-bold text-lg">{t.common.dragDrop}</span></div>
            ) : (
              tasks.map(task => (
                 <div key={task.id} className="bg-white dark:bg-[#1c1c1f] p-4 rounded-xl flex items-center gap-4 border border-zinc-100 dark:border-transparent shadow-sm transition-all group">
                    <div className="w-12 h-12 bg-pink-50 dark:bg-black/40 rounded-lg flex items-center justify-center text-pink-600 dark:text-pink-500 shrink-0"><Music className="w-6 h-6"/></div>
                    <div className="flex-1 min-w-0">
                       <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200 truncate">{task.name}</div>
                       <div className="flex items-center gap-3 mt-2">
                          <div className="h-1.5 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                             {task.status !== 'pending' && <div className="h-full bg-pink-500 rounded-full transition-all duration-300" style={{width: `${task.progress}%`}}/>}
                          </div>
                          <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 min-w-[3em] text-right font-mono">{task.status === 'pending' ? t.status.ready : (task.status === 'done' ? t.status.done : `${task.progress}%`)}</span>
                       </div>
                    </div>
                    {task.status === 'done' ? <button onClick={() => window.api.showItemInFolder(task.resultPath)} className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"><FolderOpen className="w-5 h-5"/></button> : <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-5 h-5"/></button>}
                 </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Section title={t.audio.targetFormat}>
             <select value={config.format} onChange={e => setConfig({...config, format: e.target.value})} className="w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl p-3 outline-none focus:border-pink-500 font-medium">
               <option value="mp3">MP3</option><option value="wav">WAV</option><option value="flac">FLAC</option><option value="m4a">M4A</option><option value="ogg">OGG</option>
             </select>
          </Section>
          <Section title={t.audio.bitrate}>
             <select value={config.audioBitrate} onChange={e => setConfig({...config, audioBitrate: e.target.value})} className="w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl p-3 outline-none focus:border-pink-500 font-medium">
               <option value="320k">320k (High)</option><option value="192k">192k (Standard)</option><option value="128k">128k (Low)</option>
             </select>
          </Section>
          <Section title={t.audio.channels}>
             <select value={config.channels} onChange={e => setConfig({...config, channels: e.target.value})} className="w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl p-3 outline-none focus:border-pink-500 font-medium">
               <option value="2">{t.audio.stereo}</option><option value="1">{t.audio.mono}</option>
             </select>
          </Section>
          <Section title={t.audio.trimSettings}>
             <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Start (00:00:00)" value={config.trimStart} onChange={e => setConfig({...config, trimStart: e.target.value})} className="bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-center text-xs font-mono"/>
                <input type="text" placeholder="Duration (s)" value={config.trimEnd} onChange={e => setConfig({...config, trimEnd: e.target.value})} className="bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-center text-xs font-mono"/>
             </div>
          </Section>
        </div>
      </div>
    </div>
  )
}