import React, { useState, useRef, useEffect } from 'react'
import { Upload, FileVideo, Play, Trash2, Plus, StopCircle, VolumeX, Music } from 'lucide-react'
import { useApp } from '../contexts/AppContext'

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/5 rounded-2xl p-5 shadow-sm h-full transition-colors">
    {title && <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wider">{title}</h3>}
    {children}
  </div>
)

export default function VideoPage() {
  const { t, globalOutputDir } = useApp()
  const [tasks, setTasks] = useState([])
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef(null)

  const [config, setConfig] = useState({
    format: 'mp4',
    resolution: 'original',
    quality: 23,
    fps: '30',
    audioBitrate: '192k',
    trimStart: '',
    trimEnd: '',
    aspectRatio: '',
    mute: false,
    extractAudio: false 
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

  const handleMuteChange = (checked) => {
    setConfig(prev => ({
      ...prev,
      mute: checked,
      //静音，则强制取消提取音频
      extractAudio: checked ? false : prev.extractAudio
    }))
  }

  const handleExtractChange = (checked) => {
    setConfig(prev => ({
      ...prev,
      extractAudio: checked,
      mute: checked ? false : prev.mute
    }))
  }

  const toggleConvert = () => {
    if (isConverting) { setIsConverting(false); return }

    setIsConverting(true)
    tasks.filter(t => t.status === 'pending').forEach(task => {
      setTasks(p => p.map(t => t.id === task.id ? { ...t, status: 'processing' } : t))
      // 如果勾选了提取音频，就伪装成 'audio' 类型
      const isExtract = config.extractAudio

      window.api.convert({
        id: task.id,
        filePath: task.path,
        type: isExtract ? 'audio' : 'video', 
        config: {
          ...config,
          format: isExtract ? 'mp3' : config.format,
          outputDir: globalOutputDir
        }
      })
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-zinc-800 dark:text-white mb-1 transition-colors">{t.nav.video}</h2>
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">{t.video.formats}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => fileInputRef.current.click()} className="btn-secondary flex items-center gap-2 px-5 py-3 rounded-xl font-bold bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-colors">
            <Plus className="w-5 h-5" /> {t.common.add}
          </button>
          <button onClick={toggleConvert} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg text-white transition-all active:scale-95 ${isConverting ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isConverting ? <><StopCircle className="w-5 h-5 fill-current" /> {t.common.stop}</> : <><Play className="w-5 h-5 fill-current" /> {t.common.start}</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* 左侧列表 */}
        <div className="lg:col-span-2">
          <div onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); addFiles(e.dataTransfer.files) }} className="min-h-[420px] bg-zinc-50 dark:bg-[#121212] border-2 border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-4 flex flex-col gap-2 transition-all hover:border-blue-500 relative">
            <input type="file" multiple ref={fileInputRef} className="hidden" accept="video/*" onChange={e => addFiles(e.target.files)} />
            {tasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 pointer-events-none">
                <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6"><Upload className="w-10 h-10 opacity-50" /></div>
                <span className="font-bold text-lg">{t.common.dragDrop}</span>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="bg-white dark:bg-[#1c1c1f] p-4 rounded-xl flex items-center gap-4 shadow-sm group">
                  <FileVideo className="w-12 h-12 text-blue-500 p-2 bg-blue-50 dark:bg-black/40 rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold dark:text-zinc-200">{task.name}</div>
                    <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${task.status === 'done' ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                  {task.status === 'done' ? <button onClick={() => window.api.showItemInFolder(task.resultPath)} className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded"><FolderOpen /></button> : <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100"><Trash2 /></button>}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Section title={t.video.targetFormat}>
            <select
              value={config.format}
              onChange={e => setConfig({ ...config, format: e.target.value })}
              //提取音频，则禁用格式选择（因为强制 MP3）
              disabled={config.extractAudio}
              className={`w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl p-3 outline-none focus:border-blue-500 font-medium ${config.extractAudio ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="mp4">MP4 (H.264)</option><option value="mkv">MKV</option><option value="mov">MOV</option><option value="avi">AVI</option>
            </select>
          </Section>

          <Section title="Video Params">
            <div className={`space-y-4 transition-opacity duration-200 ${config.extractAudio ? 'opacity-30 pointer-events-none' : ''}`}>
              <div>
                <div className="flex justify-between text-xs mb-2 font-bold text-zinc-500"><span>{t.video.quality}</span><span className="text-blue-600">{config.quality}</span></div>
                <input type="range" min="0" max="51" value={config.quality} onChange={e => setConfig({ ...config, quality: e.target.value })} className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg accent-blue-600" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 mb-1 block">{t.video.resolution}</label>
                  <select value={config.resolution} onChange={e => setConfig({ ...config, resolution: e.target.value })} className="w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg p-2.5 outline-none">
                    <option value="original">Original</option><option value="1920x1080">1080P</option><option value="1280x720">720P</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 mb-1 block">{t.video.aspectRatio}</label>
                  <select value={config.aspectRatio} onChange={e => setConfig({ ...config, aspectRatio: e.target.value })} className="w-full bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 text-xs rounded-lg p-2.5 outline-none">
                    <option value="">Original</option><option value="16:9">16:9</option><option value="4:3">4:3</option><option value="2:1">2:1</option><option value="1:1">1:1</option>
                  </select>
                </div>
              </div>
            </div>
          </Section>

          <Section title={t.video.trimSettings}>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input type="text" placeholder="00:00:00" value={config.trimStart} onChange={e => setConfig({ ...config, trimStart: e.target.value })} className="bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-center text-xs font-mono" />
              <input type="text" placeholder="Seconds" value={config.trimEnd} onChange={e => setConfig({ ...config, trimEnd: e.target.value })} className="bg-zinc-100 dark:bg-black/30 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2 text-center text-xs font-mono" />
            </div>

            {/* 隔开开关区域喵 */}
            <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-white/5">
              <label className={`flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors ${config.extractAudio ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-blue-500">
                  <VolumeX className="w-4 h-4" /> {t.video.mute}
                </div>
                <input type="checkbox" checked={config.mute} onChange={e => handleMuteChange(e.target.checked)} className="accent-blue-500 w-4 h-4" />
              </label>

              {/*音频开关*/}
              <label className={`flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors ${config.mute ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-400 group-hover:text-blue-500">
                    <Music className="w-4 h-4" /> {t.video.extract}
                  </div>
                  <span className="text-[9px] text-zinc-400 pl-6">{t.video.extractTip}</span>
                </div>
                <input type="checkbox" checked={config.extractAudio} onChange={e => handleExtractChange(e.target.checked)} className="accent-blue-500 w-4 h-4" />
              </label>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}