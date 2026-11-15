import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.jsx'
import { TrendsProvider } from './data.jsx'
import { Home, Trial, Evidence, Verdict, Lab, About } from './pages.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TrendsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="trial" element={<Trial />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="verdict" element={<Verdict />} />
            <Route path="lab" element={<Lab />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TrendsProvider>
  </React.StrictMode>,
)
