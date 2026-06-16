import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Community() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  const NOTICES = [
    { title: '[공지] 2026년 하반기 오프라인 부트캠프 일정 안내', date: '2026.06.10' },
    { title: '[공지] 정보처리기사 2026년 1회 시험 일정 업데이트', date: '2026.05.20' },
    { title: '[이벤트] 친구 추천 시 양쪽 30% 할인 쿠폰 지급', date: '2026.05.15' },
  ]

  return (
    <main>
      <section className="phero">
        <div className="phero__bgword">COMMUNITY</div>
        <div className="wrap phero__inner">
          <div className="crumb"><Link to="/">HOME</Link><span className="sep">/</span><span>커뮤니티</span></div>
          <h1>COMMUNITY<span className="kr">함께 성장하는 커뮤니티</span></h1>
          <p className="phero__sub">공지사항, Q&amp;A, 스터디 모집까지 — 드림아이티비즈 수강생들의 공간입니다.</p>
        </div>
      </section>

      <section className="section" id="notice">
        <div className="wrap">
          <div className="shead">
            <div><span className="shead__eyebrow mono-label">Notice</span>
              <h2><span className="kr">공지사항</span>ANNOUNCEMENTS</h2>
            </div>
          </div>
          <div className="notice-list">
            {NOTICES.map(n => (
              <div key={n.title} className="notice-item">
                <span className="notice-item__date">{n.date}</span>
                <span className="notice-item__title">{n.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt" id="qna">
        <div className="wrap">
          <div className="shead">
            <div><span className="shead__eyebrow mono-label">Q&amp;A</span>
              <h2><span className="kr">질문 &amp; 답변</span>Q&amp;A BOARD</h2>
            </div>
          </div>
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--muted)' }}>불러오는 중...</p>
          ) : posts.length ? (
            <div className="notice-list">
              {posts.map(p => (
                <div key={p.id} className="notice-item">
                  <span className="notice-item__date">{new Date(p.created_at).toLocaleDateString('ko-KR')}</span>
                  <span className="notice-item__title">{p.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px' }}>
              {user ? '아직 게시글이 없습니다. 첫 질문을 남겨보세요!' : '로그인 후 질문을 남길 수 있습니다.'}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
