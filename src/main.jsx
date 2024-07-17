import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
import CardFlipApp from './Components/CardFlip/CardFlipApp'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CardFlipApp />
    {/* <App /> */}
  </React.StrictMode>,
)
