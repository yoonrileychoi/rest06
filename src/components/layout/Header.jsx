import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoginModal from '../auth/LoginModal'
import './Header.css'

const MENU = [
  { key: 'about', label: 'About', path: '/about', sub: [
    { label: '회사소개', path: '/about#company' },
    { label: '강사소개', path: '/about#mentors' },
    { label: '오시는 길', path: '/about#location' },
  ]},
  { key: 'courses', label: '강의', path: '/courses', sub: [
    { label: '온라인 강의', path: '/courses#online' },
    { label: '오프라인 강의', path: '/courses#offline' },
  ]},
  { key: 'corporate', label: '기업교육', path: '/corporate', sub: [
    { label: '교육 제안', path: '/corporate#proposal' },
    { label: '강의 내역', path: '/corporate#history' },
  ]},
  { key: 'certs', label: '자격증', path: '/certifications', sub: [
    { label: 'AWS', path: '/certifications#aws' },
    { label: 'SQLD', path: '/certifications#sqld' },
    { label: '정보처리기사', path: '/certifications#info' },
    { label: '컴퓨터활용능력', path: '/certifications#comp' },
  ]},
  { key: 'ai', label: 'AI 활용', path: '/ai' },
  { key: 'community', label: '커뮤니티', path: '/community' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isHome = location.pathname === '/' || location.pathname === '/rest06/'

  return (
    <>
      <header className={`nav ${scrolled ? 'float' : ''} ${isHome && !scrolled ? 'on-hero' : ''}`}>
        <div className="wrap nav__inner">
          <Link to="/" className="brand">
            <span className="dot">D</span>Dream<b>IT</b>
          </Link>

          <nav className="nav__links">
            {MENU.map(item => (
              <div className="has-sub" key={item.key}>
                <Link
                  className={`nlink ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                  to={item.path}
                >
                  {item.label}
                  {item.sub && (
                    <svg className="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  )}
                </Link>
                {item.sub && (
                  <div className="dropdown">
                    <div className="dropdown__inner">
                      {item.sub.map(s => (
                        <Link key={s.label} to={s.path}>{s.label}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="nav__right">
            {user ? (
              <div className="nav__user">
                <span className="nav__user-name">{user.user_metadata?.full_name || user.email}</span>
                <button className="nav__cta--ghost" onClick={signOut}>로그아웃</button>
              </div>
            ) : (
              <button className="nav__cta--ghost" onClick={() => setShowLogin(true)}>로그인</button>
            )}
            <button
              className="nav__hamburger"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="메뉴"
            >
              <span/><span/><span/>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="nav__mobile">
            {MENU.map(item => (
              <Link key={item.key} className="nlink" to={item.path}>{item.label}</Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 12, marginTop: 8 }}>
              {user ? (
                <button className="nav__cta--ghost" onClick={signOut}>로그아웃</button>
              ) : (
                <button className="nav__cta--ghost" onClick={() => { setShowLogin(true); setMobileOpen(false) }}>로그인</button>
              )}
            </div>
          </div>
        )}
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}
