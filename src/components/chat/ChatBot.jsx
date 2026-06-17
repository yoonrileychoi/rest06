import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import './ChatBot.css'

const SYSTEM_PROMPT = `당신은 드림아이티비즈(DreamIT BIZ) 온라인 IT 교육 플랫폼의 AI 학습 도우미 '드림봇'입니다.
수강생들의 IT 학습, 강좌 선택, 자격증 준비, 취업 정보에 관한 질문에 친절하고 전문적으로 답변해주세요.
제공 강좌: 풀스택 웹 개발 부트캠프, 정보처리기사, 파이썬 & 생성형 AI, React 실전, 엑셀 자동화, SQLD.
답변은 간결하게, 항상 한국어로 답변하세요.`

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '안녕하세요! 드림아이티비즈 AI 학습 도우미 드림봇입니다 😊\n강좌 선택, 자격증 준비, 취업 정보 등 무엇이든 물어보세요!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiConfig, setApiConfig] = useState(null)
  const [configError, setConfigError] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && !apiConfig && !configError) {
      loadApiConfig()
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function loadApiConfig() {
    const { data, error } = await supabase
      .from('chat_config')
      .select('solar_api_key, openai_api_key, preferred_provider')
      .eq('id', 1)
      .single()

    if (error || !data) {
      setConfigError('API 설정을 불러올 수 없습니다. Supabase chat_config 테이블을 확인해주세요.')
      return
    }
    if (!data.solar_api_key && !data.openai_api_key) {
      setConfigError('API 키가 설정되지 않았습니다. Supabase chat_config 테이블에 키를 등록해주세요.')
      return
    }
    setApiConfig(data)
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const reply = await callAI(newMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '죄송합니다, 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      }])
    } finally {
      setLoading(false)
    }
  }

  async function callAI(msgs) {
    if (!apiConfig) throw new Error('API config not loaded')

    const provider = apiConfig.preferred_provider || 'solar'
    const useSolar = provider === 'solar' && apiConfig.solar_api_key

    const endpoint = useSolar
      ? 'https://api.upstage.ai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    const apiKey = useSolar ? apiConfig.solar_api_key : apiConfig.openai_api_key
    const model = useSolar ? 'solar-pro' : 'gpt-4o-mini'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...msgs.map(m => ({ role: m.role, content: m.content }))
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error?.message || `API error ${res.status}`)
    }
    const data = await res.json()
    return data.choices[0].message.content
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
            {configError && (
              <div className="chatbot-error">{configError}</div>
            )}
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

          <div className="chatbot-footer">
            <input
              ref={inputRef}
              className="chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="질문을 입력하세요..."
              disabled={loading || !!configError}
              maxLength={500}
            />
            <button
              className="chatbot-send"
              onClick={sendMessage}
              disabled={loading || !input.trim() || !!configError}
              aria-label="전송"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
