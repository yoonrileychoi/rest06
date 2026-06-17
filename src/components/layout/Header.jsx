import { useState, useEffect, useRef, useCallback } from 'react'
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

const PALETTES = [
  { id: 'navygold',  name: '다크블루 · 골드',    p: '#1C2C5A', s: '#F2B829' },
  { id: 'meritz',    name: '레드 · 네이비',       p: '#C42E3C', s: '#1B2A57' },
  { id: 'forest',    name: '포레스트 · 샌드',     p: '#1F4E3D', s: '#E0B252' },
  { id: 'charcoal',  name: '차콜 · 코랄',         p: '#2A3540', s: '#E0694B' },
  { id: 'teal',      name: '틸 · 클레이',         p: '#155E63', s: '#D98B5F' },
  { id: 'plum',      name: '플럼 · 블러시',       p: '#4A2A47', s: '#DD8298' },
  { id: 'slate',     name: '슬레이트 · 스카이',   p: '#2E3A59', s: '#5B8FB0' },
  { id: 'burgundy',  name: '버건디 · 카멜',       p: '#6E1F2E', s: '#C99A5B' },
]

const PKEY = 'dreamit-palette'
const MKEY = 'dreamit-mode'

function getSavedPalette() {
  try { return localStorage.getItem(PKEY) || 'navygold' } catch { return 'navygold' }
}
function getSavedMode() {
  try { return localStorage.getItem(MKEY) === 'dark' } catch { return false }
}

export default function Header() {
  const [scrolled, setScrolled]     = useState(false)
  const [showLogin, setShowLogin]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [palette, setPalette]       = useState(getSavedPalette)
  const [darkMode, setDarkMode]     = useState(getSavedMode)
  const [palOpen, setPalOpen]       = useState(false)
  const { user, signOut }           = useAuth()
  const location                    = useLocation()
  const palBtnRef                   = useRef(null)
  const palPopRef                   = useRef(null)
  const hoverTimer                  = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Swap palette CSS file
  useEffect(() => {
    const link = document.getElementById('paletteCss')
    if (link) link.href = `/rest06/themes/${palette}.css`
    try { localStorage.setItem(PKEY, palette) } catch {}
  }, [palette])

  // Toggle dark class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    try { localStorage.setItem(MKEY, darkMode ? 'dark' : 'light') } catch {}
  }, [darkMode])

  // Close popover on outside click
  useEffect(() => {
    if (!palOpen) return
    function onOutside(e) {
      if (
        palPopRef.current && !palPopRef.current.contains(e.target) &&
        palBtnRef.current && !palBtnRef.current.contains(e.target)
      ) setPalOpen(false)
    }
    document.addEventListener('click', onOutside, true)
    return () => document.removeEventListener('click', onOutside, true)
  }, [palOpen])

  const openPal  = useCallback(() => { clearTimeout(hoverTimer.current); setPalOpen(true) }, [])
  const closePal = useCallback(() => { clearTimeout(hoverTimer.current); setPalOpen(false) }, [])
  const schedClose = useCallback(() => { hoverTimer.current = setTimeout(() => setPalOpen(false), 220) }, [])
  const cancelClose = useCallback(() => clearTimeout(hoverTimer.current), [])

  const isHome = location.pathname === '/' || location.pathname === '/rest06/'

  const currentPal = PALETTES.find(p => p.id === palette) || PALETTES[0]

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
            {/* Palette + mode tools */}
            <div className="nav__tools">
              {/* Palette picker button */}
              <div className="nav__pal-wrap">
                <button
                  ref={palBtnRef}
                  className="ntool palette-btn"
                  aria-label="컬러 테마 선택"
                  onClick={e => { e.stopPropagation(); setPalOpen(v => !v) }}
                  onMouseEnter={openPal}
                  onMouseLeave={schedClose}
                >
                  <span className="pal-swatch">
                    <i style={{ background: currentPal.p }} />
                    <i style={{ background: currentPal.s }} />
                  </span>
                </button>

                {/* Palette popover */}
                <div
                  ref={palPopRef}
                  className={`palette-pop${palOpen ? ' open' : ''}`}
                  hidden={!palOpen}
                  onMouseEnter={cancelClose}
                  onMouseLeave={schedClose}
                >
                  <h6>컬러 테마</h6>
                  <div className="pal-grid">
                    {PALETTES.map(pal => (
                      <button
                        key={pal.id}
                        className="pal-opt"
                        data-on={pal.id === palette ? '1' : '0'}
                        onClick={() => { setPalette(pal.id); closePal() }}
                      >
                        <span className="sw">
                          <i style={{ background: pal.p }} />
                          <i style={{ background: pal.s }} />
                        </span>
                        <span className="nm">{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dark / light mode button */}
              <button
                className="ntool mode-btn"
                aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
                onClick={() => setDarkMode(v => !v)}
              >
                {/* Sun icon (shown in dark mode) */}
                <svg className="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
                {/* Moon icon (shown in light mode) */}
                <svg className="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              </button>
            </div>

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
