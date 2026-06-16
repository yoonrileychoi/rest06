import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usePayment } from '../components/payment/usePayment'
import LoginModal from '../components/auth/LoginModal'

const ALL_COURSES = [
  { id: 'c1', img: '/rest06/assets/courses/c1.png', badge: 'BEST', level: '입문', cat: '웹 개발', title: '제로부터 시작하는 풀스택 웹 개발 부트캠프', rating: 4.9, students: '21,400', hours: '32시간', type: 'online', originalPrice: 290000, price: 149000, off: 48 },
  { id: 'c2', img: '/rest06/assets/courses/c2.png', badge: '합격보장', level: '자격증', cat: '국가자격증', title: '정보처리기사 필기·실기 한 번에 끝내기', rating: 4.8, students: '38,900', hours: '54시간', type: 'online', originalPrice: 220000, price: 119000, off: 45 },
  { id: 'c3', img: '/rest06/assets/courses/c3.png', badge: 'NEW', level: '중급', cat: '데이터 · AI', title: '파이썬 데이터 분석 & 생성형 AI 실무 완성', rating: 4.9, students: '12,700', hours: '40시간', type: 'online', originalPrice: 320000, price: 179000, off: 44 },
  { id: 'c4', img: '/rest06/assets/courses/c4.png', badge: '실무', level: '중급', cat: '프론트엔드', title: 'React로 만드는 실전 프로젝트 5개', rating: 4.9, students: '9,300', hours: '28시간', type: 'online', originalPrice: 250000, price: 139000, off: 44 },
  { id: 'c5', img: '/rest06/assets/courses/c5.png', badge: '인기', level: '입문', cat: '컴퓨터 활용', title: '실무 엑셀 마스터 — 함수부터 자동화까지', rating: 4.8, students: '27,600', hours: '22시간', type: 'offline', originalPrice: 150000, price: 79000, off: 47 },
  { id: 'c6', img: '/rest06/assets/courses/c6.png', badge: '취업연계', level: '중급', cat: '데이터 엔지니어링', title: 'SQLD 자격증 + 실무 데이터베이스 설계', rating: 4.9, students: '8,100', hours: '26시간', type: 'offline', originalPrice: 210000, price: 109000, off: 48 },
]

function CourseCard({ course }) {
  const { user } = useAuth()
  const { requestPayment } = usePayment()
  const [showLogin, setShowLogin] = useState(false)
  const [paying, setPaying] = useState(false)

  const handleBuy = async () => {
    if (!user) { setShowLogin(true); return }
    setPaying(true)
    const r = await requestPayment({ course, amount: course.price })
    setPaying(false)
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
            <button className="btn btn--sm btn--primary" onClick={handleBuy} disabled={paying}>
              {paying ? '처리 중...' : '수강 신청'}
            </button>
          </div>
        </div>
      </article>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  )
}

export default function Courses() {
  const [activeTab, setActiveTab] = useState('online')

  const filtered = ALL_COURSES.filter(c => c.type === activeTab)

  return (
    <main>
      <section className="phero">
        <div className="phero__bgword">LEARN</div>
        <div className="wrap phero__inner">
          <div className="crumb"><Link to="/">HOME</Link><span className="sep">/</span><span>강의</span></div>
          <h1>COURSES<span className="kr">온라인으로 가볍게, 오프라인으로 깊게</span></h1>
          <p className="phero__sub">같은 커리큘럼, 두 가지 방식. 내 일정과 학습 스타일에 맞춰 골라 들으세요.</p>
        </div>
      </section>

      <div className="tabbar">
        <div className="wrap"><div className="tabbar__row">
          <button className={`tab ${activeTab === 'online' ? 'on' : ''}`} onClick={() => setActiveTab('online')}>온라인 강의</button>
          <button className={`tab ${activeTab === 'offline' ? 'on' : ''}`} onClick={() => setActiveTab('offline')}>오프라인 부트캠프</button>
        </div></div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">{activeTab === 'online' ? 'Online · 무제한 수강' : 'Offline · 현장 집중'}</span>
              <h2><span className="kr">{activeTab === 'online' ? '온라인 강의' : '오프라인 부트캠프'}</span>{activeTab === 'online' ? 'WATCH ANYTIME' : 'LEARN IN PERSON'}</h2>
            </div>
          </div>
          <div className="courses">
            {filtered.map(c => <CourseCard key={c.id} course={c} />)}
          </div>
        </div>
      </section>
    </main>
  )
}
