export default {
  nav: { video: '動画変換', audio: '音声変換', image: '画像処理', settings: '設定' },
  common: { 
    start: '変換開始', stop: '停止', add: 'ファイル追加', clear: 'リスト消去', 
    output: '出力先', selectDir: '変更', openDir: 'フォルダを開く',
    dragDrop: 'ここにドラッグ または クリック', noTasks: 'タスクなし'
  },
  status: { ready: '準備完了', processing: '処理中', done: '完了', error: '失敗' },
  video: { 
    formats: 'MP4, MKV, AVI, MOV, WEBM に対応',
    targetFormat: '出力フォーマット',
    quality: '圧縮強度 (CRF)', qualityTip: '値が大きいほど容量削減',
    resolution: '解像度', fps: 'フレームレート (FPS)', aspectRatio: 'アスペクト比',
    trimSettings: 'トリミング & 音声', audioBitrate: 'ビットレート',
    startTime: '開始時間', duration: '長さ (秒)',
    mute: '音声を削除 (ミュート)', 
    extract: '音声のみ出力 (MP3)', 
    extractTip: 'Audioフォルダに保存'
  },
  audio: {
    formats: 'MP3, WAV, FLAC, M4A, OGG に対応',
    targetFormat: '出力フォーマット', bitrate: 'ビットレート', channels: 'チャンネル',
    stereo: 'ステレオ', mono: 'モノラル',
    trimSettings: 'トリミング設定'
  },
  image: {
    formats: 'JPG, PNG, WEBP, ICO に対応',
    targetFormat: '出力フォーマット', resize: 'サイズ変更',
    width: '幅 (px)', ratio: 'アスペクト比',
    original: 'オリジナル'
  },
  settings: {
    title: '設定', general: '一般設定', theme: 'テーマ', lang: '言語',
    output: 'デフォルト出力先', outputTip: 'ファイルは自動的にサブフォルダに振り分けられます',
    about: 'ソフトウェアについて'
  }
}