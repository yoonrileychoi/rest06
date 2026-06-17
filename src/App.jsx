import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import Certifications from './pages/Certifications'
import AI from './pages/AI'
import Community from './pages/Community'
import Corporate from './pages/Corporate'
import ChatBot from './components/chat/ChatBot'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/community" element={<Community />} />
        <Route path="/corporate" element={<Corporate />} />
      </Routes>
      <Footer />
      <ChatBot />
    </>
  )
}
