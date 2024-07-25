import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import Dashboard from './Dashboard.jsx'

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/dashBoard' element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
