import React, { useState, useRef, useEffect } from 'react'
import { Upload, Image as ImageIcon, Play, Trash2, Plus, StopCircle, FolderOpen } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm h-full transition-colors">
    {title && <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">{title}</h3>}
    {children}
  </div>
)

export default function ImagePage() {
  const { t, globalOutputDir } = useApp()
  const [tasks, setTasks] = useState([])
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef(null)

  const [config, setConfig] = useState({
    format: 'webp',
    resolution: 'original', 
    customWidth: '',      
    aspectRatio: ''       
  })

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
        id: Math.random().toString(36).slice(2), name: f.name,
        path: window.api?.getFilePath ? window.api.getFilePath(f) : f.path,
        status: 'pending', progress: 0
      }))
      setTasks(p => [...p, ...newTasks])
    }
  }

  const toggleConvert = () => {
    if (isConverting) { setIsConverting(false); return }
    setIsConverting(true)

    let finalWidth = null
    if (config.resolution !== 'original') {
      finalWidth = config.resolution === 'custom' ? config.customWidth : config.resolution
    }

    tasks.filter(t => t.status === 'pending').forEach(task => {
      setTasks(p => p.map(t => t.id === task.id ? { ...t, status: 'processing' } : t))
      window.api.convert({
        id: task.id,
        filePath: task.path,
        type: 'image',
        config: {
          ...config,
          width: finalWidth, 
          outputDir: globalOutputDir
        }
      })
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-zinc-800 dark:text-white mb-1 transition-colors">{t.nav.image}</h2>
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">{t.image.formats}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => fileInputRef.current.click()} className="btn-secondary flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors">
            <Plus className="w-5 h-5" /> {t.common.add}
          </button>
          <button onClick={toggleConvert} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg text-white transition-all active:scale-95 ${isConverting ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
            {isConverting ? <><StopCircle className="w-5 h-5 fill-current" /> {t.common.stop}</> : <><Play className="w-5 h-5 fill-current" /> {t.common.start}</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* 左侧列表*/}
        <div className="lg:col-span-2">
          <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files) }} className="min-h-[420px] bg-zinc-50 dark:bg-[#121212] border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:border-emerald-500 relative cursor-default">
            <input type="file" multiple ref={fileInputRef} className="hidden" accept="image/*" onChange={e => addFiles(e.target.files)} />
            {tasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 pointer-events-none"><div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6"><ImageIcon className="w-10 h-10 opacity-50" /></div><span className="font-bold text-lg">{t.common.dragDrop}</span></div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="bg-white dark:bg-[#1c1c1f] p-4 rounded-xl flex items-center gap-4 border border-zinc-100 dark:border-transparent shadow-sm transition-all group">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-black/40 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-500 shrink-0"><ImageIcon className="w-6 h-6" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-700 dark:text-zinc-200 truncate">{task.name}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="h-1.5 flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${task.status === 'done' ? 'bg-emerald-500' : 'bg-emerald-600'}`} style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 min-w-[3em] text-right font-mono">{task.status === 'pending' ? t.status.ready : (task.status === 'done' ? t.status.done : `${task.progress}%`)}</span>
                    </div>
                  </div>
                  {task.status === 'done' ? <button onClick={() => window.api.showItemInFolder(task.resultPath)} className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"><FolderOpen className="w-5 h-5" /></button> : <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-5 h-5" /></button>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Section title={t.image.targetFormat}>
            <select value={config.format} onChange={e => setConfig({ ...config, format: e.target.value })} className="w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl p-3 outline-none focus:border-emerald-500 font-medium">
              <option value="webp">WEBP</option><option value="png">PNG</option><option value="jpg">JPG</option><option value="ico">ICO</option><option value="tiff">TIFF</option>
            </select>
          </Section>

          <Section title={t.image.resize}>
            <div className="space-y-4">
              {/*分辨率选择 */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 mb-1.5 block">{t.image.width}</label>
                <select
                  value={config.resolution}
                  onChange={e => setConfig({ ...config, resolution: e.target.value })}
                  className="w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200 rounded-lg p-2.5 outline-none"
                >
                  <option value="original">{t.image.original || 'Original'}</option>
                  <option value="1920">1920 px (FHD)</option>
                  <option value="1280">1280 px (HD)</option>
                  <option value="800">800 px</option>
                  <option value="custom">Custom...</option>
                </select>
                {config.resolution === 'custom' && (
                  <input
                    type="number"
                    placeholder="Input width (px)"
                    value={config.customWidth}
                    onChange={e => setConfig({ ...config, customWidth: e.target.value })}
                    className="w-full mt-2 bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg p-2.5 outline-none animate-in fade-in slide-in-from-top-1"
                  />
                )}
              </div>

              {/*宽高比*/}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 mb-1.5 block">{t.image.ratio || 'Aspect Ratio'}</label>
                <select
                  value={config.aspectRatio}
                  onChange={e => setConfig({ ...config, aspectRatio: e.target.value })}
                  className="w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-200 rounded-lg p-2.5 outline-none"
                >
                  <option value="">{t.image.original || 'Original'}</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="4:3">4:3</option>
                  <option value="2:1">2:1</option>
                </select>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}