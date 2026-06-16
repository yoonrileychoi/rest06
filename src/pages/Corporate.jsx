import { Link } from 'react-router-dom'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Corporate() {
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    const { error } = await supabase.from('corporate_inquiries').insert({ ...form, created_at: new Date().toISOString() })
    setSending(false)
    if (!error) { setSent(true); setForm({ company: '', name: '', email: '', phone: '', message: '' }) }
  }

  return (
    <main>
      <section className="phero" id="proposal">
        <div className="phero__bgword">B2B</div>
        <div className="wrap phero__inner">
          <div className="crumb"><Link to="/">HOME</Link><span className="sep">/</span><span>기업교육</span></div>
          <h1>CORPORATE<span className="kr">팀 전체를 성장시키는 기업 맞춤 교육</span></h1>
          <p className="phero__sub">그룹 라이선스부터 맞춤형 커리큘럼까지. 350+ 파트너사가 선택한 기업 교육 솔루션.</p>
        </div>
      </section>

      <section className="section" id="history">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">Partners</span>
              <h2><span className="kr">파트너사</span>OUR CLIENTS</h2>
            </div>
          </div>
          <div className="logos">
            {['NEXON','KAKAO·B','LINE+','COUPANG','BAEMIN','TOSS','NAVER·C','SAMSUNG','LG·CNS','KT·DS','우아한형제','당근'].map(name => (
              <div key={name} className="logo">{name}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">Contact</span>
              <h2><span className="kr">기업 교육 문의</span>GET IN TOUCH</h2>
            </div>
          </div>
          {sent ? (
            <div className="icard" style={{ textAlign: 'center', padding: '40px' }}>
              <h3>문의가 접수되었습니다!</h3>
              <p>담당자가 1영업일 내에 연락드리겠습니다.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input required placeholder="회사명" value={form.company} onChange={e => setForm(p => ({...p, company: e.target.value}))} />
                <input required placeholder="담당자명" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
              </div>
              <div className="form-row">
                <input required type="email" placeholder="이메일" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} />
                <input placeholder="연락처" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} />
              </div>
              <textarea required rows={5} placeholder="교육 니즈 및 문의 내용을 작성해 주세요." value={form.message} onChange={e => setForm(p => ({...p, message: e.target.value}))} />
              <button type="submit" className="btn btn--primary" disabled={sending}>
                {sending ? '전송 중...' : '문의 보내기'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
