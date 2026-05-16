import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DrapeProvider } from './context/DrapeContext.jsx'
import Home from './pages/Home.jsx'
import Results from './pages/Results.jsx'
import About from './pages/About.jsx'
import Auth from './pages/Auth.jsx'
import Nav from './components/Nav.jsx'
import ConsentBanner from './components/ConsentBanner.jsx'

export default function App() {
  return (
    <DrapeProvider>
      <BrowserRouter>
        <Nav />
        <ConsentBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </DrapeProvider>
  )
}
