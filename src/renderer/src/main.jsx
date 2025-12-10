import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import './assets/css/main.css'

console.log('React入口文件正在执行')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)