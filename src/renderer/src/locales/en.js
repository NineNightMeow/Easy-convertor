export default {
  nav: { video: 'Video', audio: 'Audio', image: 'Image', settings: 'Settings' },
  common: { 
    start: 'Start', stop: 'Stop', add: 'Add Files', clear: 'Clear', 
    output: 'Output Dir', selectDir: 'Change', openDir: 'Open Folder',
    dragDrop: 'Drag files here or Click to upload', noTasks: 'No tasks'
  },
  status: { ready: 'READY', processing: 'PROCESSING', done: 'DONE', error: 'ERROR' },
  video: { 
    formats: 'Supports MP4, MKV, AVI, MOV, WEBM',
    targetFormat: 'Target Format',
    quality: 'Compression (CRF)', qualityTip: 'Higher value = Smaller size',
    resolution: 'Resolution', fps: 'Framerate (FPS)', aspectRatio: 'Aspect Ratio',
    trimSettings: 'Trim & Audio', audioBitrate: 'Audio Bitrate',
    startTime: 'Start Time', duration: 'Duration',
    mute: 'Mute Audio', 
    extract: 'Export Audio Only (MP3)', 
    extractTip: 'Saved to Audio folder'
  },
  audio: {
    formats: 'Supports MP3, WAV, FLAC, M4A, OGG',
    targetFormat: 'Target Format', bitrate: 'Bitrate', channels: 'Channels',
    stereo: 'Stereo', mono: 'Mono',
    trimSettings: 'Trim Settings'
  },
  image: {
    formats: 'Supports JPG, PNG, WEBP, ICO',
    targetFormat: 'Target Format', resize: 'Resize Settings',
    width: 'Width (px)', ratio: 'Aspect Ratio',
    original: 'Original'
  },
  settings: {
    title: 'Settings', general: 'General', theme: 'Theme', lang: 'Language',
    output: 'Default Output Path', outputTip: 'Files will be saved in subfolders (video/audio/image)',
    about: 'About'
  }
}