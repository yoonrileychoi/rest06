import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './ChatBot.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export default function ChatBot() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '안녕하세요! 드림아이티비즈 AI 학습 도우미 드림봇입니다 😊\n강좌 선택, 자격증 준비, 취업 정보 등 무엇이든 물어보세요!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && user) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, user])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await callEdgeFunction(newMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: e.message || '죄송합니다, 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      }])
    } finally {
      setLoading(false)
    }
  }

  async function callEdgeFunction(msgs) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) throw new Error('로그인 후 이용하실 수 있습니다.')

    const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        messages: msgs.map(m => ({ role: m.role, content: m.content }))
      })
    })

    const data = await res.json()
    if (!res.ok || data.error) throw new Error(data.error || `오류 ${res.status}`)
    return data.content
  }

  return (
    <>
      <button
        className={`chatbot-fab${open ? ' chatbot-fab--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="AI 채팅 도우미 열기"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        )}
        {!open && <span className="chatbot-fab__dot" />}
      </button>

      {open && (
        <div className="chatbot-popup" role="dialog" aria-label="AI 채팅 도우미">
          <div className="chatbot-header">
            <div className="chatbot-header__info">
              <div className="chatbot-avatar">AI</div>
              <div>
                <div className="chatbot-header__name">드림봇</div>
                <div className="chatbot-header__sub">DreamIT BIZ AI 학습 도우미</div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="닫기">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg chatbot-msg--${m.role}`}>
                {m.role === 'assistant' && <div className="chatbot-msg__av">AI</div>}
                <div className="chatbot-msg__bubble">
                  {m.content.split('\n').map((line, j) => (
                    <span key={j}>{line}{j < m.content.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg--assistant">
                <div className="chatbot-msg__av">AI</div>
                <div className="chatbot-msg__bubble chatbot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {user ? (
            <div className="chatbot-footer">
              <input
                ref={inputRef}
                className="chatbot-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="질문을 입력하세요..."
                disabled={loading}
                maxLength={500}
              />
              <button
                className="chatbot-send"
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="전송"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="chatbot-login-prompt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              <p>로그인 후 드림봇을 이용할 수 있어요</p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
