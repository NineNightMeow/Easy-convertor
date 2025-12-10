export default {
  nav: { video: '视频转换', audio: '音频转换', image: '图像处理', settings: '设置' },
  common: { 
    start: '开始转换', stop: '停止转换', add: '添加文件', clear: '清空列表', 
    output: '输出目录', selectDir: '更改目录', openDir: '打开文件夹',
    dragDrop: '拖入文件 或 点击上传', noTasks: '暂无任务'
  },
  status: { ready: '就绪', processing: '转换中', done: '完成', error: '失败' },
  video: { 
    formats: '支持 MP4, MKV, AVI, MOV, WEBM',
    targetFormat: '目标格式',
    quality: '压缩强度 (CRF)', qualityTip: '数值越大体积越小',
    resolution: '分辨率', fps: '帧率 (FPS)', aspectRatio: '画面比例',
    trimSettings: '剪辑 & 音频', audioBitrate: '音频码率',
    startTime: '开始时间', duration: '持续时长',
    mute: '去除音频 (静音)', 
    extract: '仅导出音频 (MP3)', 
    extractTip: '将自动保存至 Audio 文件夹' 
  },
  audio: {
    formats: '支持 MP3, WAV, FLAC, M4A, OGG',
    targetFormat: '目标格式', bitrate: '比特率', channels: '声道',
    stereo: '立体声 (Stereo)', mono: '单声道 (Mono)',
    trimSettings: '裁剪设置'
  },
  image: {
    formats: '支持 JPG, PNG, WEBP, ICO',
    targetFormat: '目标格式', resize: '尺寸设置',
    width: '宽度 (px)', ratio: '宽高比',
    original: '保持原图'
  },
  settings: {
    title: '设置', general: '常规设置', theme: '外观主题', lang: '界面语言',
    output: '默认输出路径', outputTip: '文件将自动分类保存到该目录下的对应文件夹中',
    about: '关于软件'
  }
}