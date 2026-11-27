import { createRoot } from 'react-dom/client'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import App from './App.jsx'
import './style.css'
import './editorial/tactile.css'
import './editorial/studio.css'

createRoot(document.getElementById('root')).render(
  <MotionConfig reducedMotion="user">
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </MotionConfig>,
)
