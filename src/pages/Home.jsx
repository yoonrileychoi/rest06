import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePayment } from '../components/payment/usePayment'
import LoginModal from '../components/auth/LoginModal'

const COURSES = [
  { id: 'c1', img: '/rest06/assets/courses/c1.png', badge: 'BEST', level: '입문', cat: '웹 개발', title: '제로부터 시작하는 풀스택 웹 개발 부트캠프', rating: 4.9, students: '21,400', hours: '32시간', originalPrice: 290000, price: 149000, off: 48 },
  { id: 'c2', img: '/rest06/assets/courses/c2.png', badge: '합격보장', level: '자격증', cat: '국가자격증', title: '정보처리기사 필기·실기 한 번에 끝내기', rating: 4.8, students: '38,900', hours: '54시간', originalPrice: 220000, price: 119000, off: 45 },
  { id: 'c3', img: '/rest06/assets/courses/c3.png', badge: 'NEW', level: '중급', cat: '데이터 · AI', title: '파이썬 데이터 분석 & 생성형 AI 실무 완성', rating: 4.9, students: '12,700', hours: '40시간', originalPrice: 320000, price: 179000, off: 44 },
  { id: 'c4', img: '/rest06/assets/courses/c4.png', badge: '실무', level: '중급', cat: '프론트엔드', title: 'React로 만드는 실전 프로젝트 5개', rating: 4.9, students: '9,300', hours: '28시간', originalPrice: 250000, price: 139000, off: 44 },
  { id: 'c5', img: '/rest06/assets/courses/c5.png', badge: '인기', level: '입문', cat: '컴퓨터 활용', title: '실무 엑셀 마스터 — 함수부터 자동화까지', rating: 4.8, students: '27,600', hours: '22시간', originalPrice: 150000, price: 79000, off: 47 },
  { id: 'c6', img: '/rest06/assets/courses/c6.png', badge: '취업연계', level: '중급', cat: '데이터 엔지니어링', title: 'SQLD 자격증 + 실무 데이터베이스 설계', rating: 4.9, students: '8,100', hours: '26시간', originalPrice: 210000, price: 109000, off: 48 },
]

const TUTORS = [
  { img: '/rest06/assets/tutors/t1.png', tag: '10년차 풀스택', name: '김재현', role: '웹 · 앱 개발 트랙', desc: '前 대형 IT기업 시니어 엔지니어. 누적 수강생 4.2만.' },
  { img: '/rest06/assets/tutors/t2.png', tag: '자격증 만점', name: '이수민', role: 'IT 국가자격증 트랙', desc: '정보처리기사·SQLD 만점 합격. 합격률 92% 비결.' },
  { img: '/rest06/assets/tutors/t3.png', tag: 'AI 리서처', name: '박도윤', role: '데이터 · AI 트랙', desc: 'ML 엔지니어 출신. 실무 데이터 프로젝트 다수 리드.' },
  { img: '/rest06/assets/tutors/t4.png', tag: '오피스 전문', name: '최하영', role: '컴퓨터 활용 트랙', desc: '기업 실무 교육 12년. 자동화 엑셀의 모든 것.' },
]

function CourseCard({ course }) {
  const { user } = useAuth()
  const { requestPayment } = usePayment()
  const [showLogin, setShowLogin] = useState(false)
  const [paying, setPaying] = useState(false)
  const [result, setResult] = useState(null)

  const handleBuy = async () => {
    if (!user) { setShowLogin(true); return }
    setPaying(true)
    const r = await requestPayment({ course, amount: course.price })
    setPaying(false)
    setResult(r)
    if (r.success) alert('결제가 완료되었습니다! 강의를 즐겁게 수강하세요.')
    else if (r.error) alert(`결제 실패: ${r.error}`)
  }

  return (
    <>
      <article className="course">
        <div className="course__thumb">
          <img className="thumb-img" src={course.img} alt={course.title} />
          <span className="badge">{course.badge}</span>
          <span className="lvl">{course.level}</span>
        </div>
        <div className="course__body">
          <span className="course__cat">{course.cat}</span>
          <h3>{course.title}</h3>
          <div className="course__meta">
            <span className="star">★ {course.rating}</span>
            <span>수강생 {course.students}</span>
            <span>{course.hours}</span>
          </div>
          <div className="course__foot">
            <div className="course__price">
              <s>{course.originalPrice.toLocaleString()}</s>
              {course.price.toLocaleString()}
              <span className="off">{course.off}%↓</span>
            </div>
            <button
              className="btn btn--sm btn--primary"
              onClick={handleBuy}
              disabled={paying}
              style={{ cursor: paying ? 'wait' : 'pointer' }}
            >
              {paying ? '처리 중...' : '수강 신청'}
            </button>
          </div>
        </div>
      </article>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default function Home() {
  const [showLogin, setShowLogin] = useState(false)
  const { user } = useAuth()

  return (
    <main>
      {/* HERO */}
      <section className="hero" id="top">
        <div className="hero__bgword">DREAM·IT</div>
        <div className="wrap hero__grid">
          <div className="hero__col">
            <span className="hero__kicker"><span className="pulse"></span>ONLINE IT ACADEMY · SINCE 2014</span>
            <h1>
              <span className="kr">코딩, 자격증,</span>
              <span className="kr">커리어까지</span>
              <span className="kr"><em>한 번에</em></span>
            </h1>
            <p className="hero__sub">취준생부터 현직 개발자, 기업 교육까지 — 15만 수강생이 선택한 실무 중심 온라인 IT 교육 플랫폼, 드림아이티비즈.</p>
            <div className="hero__cta">
              <button className="btn btn--light" onClick={() => !user && setShowLogin(true)}>
                무료로 시작하기
                <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </button>
              <Link to="/courses" className="btn btn--outline-light">강좌 둘러보기</Link>
            </div>
          </div>
          <div className="hero__cards">
            <div className="hcard"><div className="hcard__ico">★</div><div><div className="hcard__t">수강생 만족도 <b className="num">4.9</b>/5.0</div><div className="hcard__d">최근 12개월 12,400건 기준</div></div></div>
            <div className="hcard"><div className="hcard__ico">人</div><div><div className="hcard__t">누적 수강생 <b className="num">128K+</b></div><div className="hcard__d">개인 · 대학 · 기업 교육 합산</div></div></div>
            <div className="hcard"><div className="hcard__ico">↑</div><div><div className="hcard__t">취업 연계 <b className="num">350+</b></div><div className="hcard__d">기업 채용 파트너사</div></div></div>
          </div>
        </div>
        <div className="hero__scroll">SCROLL <span className="line"></span></div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          <span>WEB DEV</span><span>PYTHON</span><span>정보처리기사</span><span>DATA · AI</span><span>컴퓨터활용능력</span><span>JAVA</span><span>클라우드</span><span>코딩테스트</span>
          <span>WEB DEV</span><span>PYTHON</span><span>정보처리기사</span><span>DATA · AI</span><span>컴퓨터활용능력</span><span>JAVA</span><span>클라우드</span><span>코딩테스트</span>
        </div>
      </div>

      {/* STATS */}
      <section className="section stats">
        <div className="wrap">
          <div className="stats__grid">
            <div className="stat"><div className="stat__num"><span>128,000</span><span className="u">+</span></div><div className="stat__lab">누적 수강생 수</div></div>
            <div className="stat"><div className="stat__num"><span>420</span><span className="u">+</span></div><div className="stat__lab">개설 강좌 수</div></div>
            <div className="stat"><div className="stat__num"><span>92</span><span className="u">%</span></div><div className="stat__lab">자격증 합격률</div></div>
            <div className="stat"><div className="stat__num"><span>4.9</span><span className="u">★</span></div><div className="stat__lab">평균 강의 만족도</div></div>
          </div>
        </div>
      </section>

      {/* POPULAR COURSES */}
      <section className="section section--alt" id="courses">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">Best Sellers</span>
              <h2><span className="kr">지금 가장 인기 있는</span>POPULAR COURSES</h2>
            </div>
            <Link to="/courses" className="btn btn--ghost btn--sm">
              전체 강좌 보기
              <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
          </div>
          <div className="courses">
            {COURSES.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      </section>

      {/* TUTORS */}
      <section className="section" id="tutors">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">Mentors</span>
              <h2><span className="kr">현업 전문가가 가르칩니다</span>MEET THE MENTORS</h2>
            </div>
            <p>네카라쿠배 출신 현직 개발자와 자격증 만점 강사진이 직접 설계한 커리큘럼.</p>
          </div>
          <div className="tutors">
            {TUTORS.map(t => (
              <article key={t.name} className="tutor">
                <div className="tutor__ph">
                  <img className="tutor-img" src={t.img} alt={t.name} />
                  <span className="tag">{t.tag}</span>
                </div>
                <div className="tutor__body">
                  <h3>{t.name}</h3>
                  <div className="role">{t.role}</div>
                  <p>{t.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section" id="reviews">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">Success Stories</span>
              <h2><span className="kr">수강생이 증명합니다</span>REAL RESULTS</h2>
            </div>
            <p>학습이 커리어로 이어진 진짜 이야기. 다음 주인공은 당신입니다.</p>
          </div>
          <div className="tstm">
            <article className="tq">
              <div className="tq__mark">"</div>
              <p className="tq__txt">비전공자였는데 6개월 풀스택 트랙 끝내고 <b>스타트업 개발자로 취업</b>했어요. 프로젝트 리뷰가 진짜 실무 같아서 면접 때 자신 있었습니다.</p>
              <span className="tq__result">↑ 마케터 → 백엔드 개발자</span>
              <div className="tq__who"><div className="tq__av" style={{background:'#1C2C5A'}}>정</div><div><div className="n">정민서</div><div className="r">풀스택 부트캠프 수료</div></div></div>
            </article>
            <article className="tq">
              <div className="tq__mark">"</div>
              <p className="tq__txt">직장 다니면서 <b>정보처리기사 한 번에 합격</b>했습니다. 출퇴근길에 강의 듣고 모의고사 돌린 게 전부였는데 기출 분석이 정말 정확했어요.</p>
              <span className="tq__result">✓ 정보처리기사 최종 합격</span>
              <div className="tq__who"><div className="tq__av" style={{background:'#C42E3C'}}>한</div><div><div className="n">한지우</div><div className="r">직장인 · 30대</div></div></div>
            </article>
            <article className="tq">
              <div className="tq__mark">"</div>
              <p className="tq__txt">우리 팀 전체가 <b>데이터·AI 트랙으로 사내 교육</b>을 받았어요. 실무 데이터로 바로 적용 가능한 커리큘럼이라 만족도가 압도적이었습니다.</p>
              <span className="tq__result">★ B2B 기업 교육 도입</span>
              <div className="tq__who"><div className="tq__av" style={{background:'#155E63'}}>L</div><div><div className="n">이준호 팀장</div><div className="r">제조 IT기업 HRD</div></div></div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta section" id="enroll">
        <div className="cta__bgword">JOIN US</div>
        <div className="wrap cta__inner">
          <div className="cta__eyebrow">오늘 시작하면, 6개월 뒤가 달라집니다</div>
          <h2><span className="kr">지금, 코딩을</span>START TODAY</h2>
          <p className="cta__sub">회원가입 한 번이면 전 강좌 1강이 무료. 카드 등록 없이 바로 학습을 시작하세요.</p>
          <div className="cta__btns">
            <button className="btn btn--light" onClick={() => !user && setShowLogin(true)}>
              무료로 시작하기
              <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            <Link to="/corporate" className="btn btn--outline-light">기업 교육 문의</Link>
          </div>
        </div>
      </section>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </main>
  )
}
