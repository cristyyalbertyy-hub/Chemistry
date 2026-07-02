import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'
import { AuthGate } from './components/AuthGate'
import { COURSE_TITLE } from './data/courseData'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AuthGate appTitle={COURSE_TITLE}>
        <App />
      </AuthGate>
    </AuthProvider>
  </StrictMode>,
)
