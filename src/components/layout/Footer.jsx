import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div>
            <Link to="/" className="brand"><span className="dot">D</span>Dream<b>IT</b></Link>
            <p className="foot__intro">코딩, 자격증, AI까지 — 15만 수강생이 선택한 실무 중심 온라인 IT 교육 플랫폼.</p>
          </div>
          <div className="foot__col">
            <h5>강의</h5>
            <Link to="/courses#online">온라인 강의</Link>
            <Link to="/courses#offline">오프라인 강의</Link>
            <Link to="/certifications">자격증 과정</Link>
            <Link to="/ai">AI 활용</Link>
          </div>
          <div className="foot__col">
            <h5>회사</h5>
            <Link to="/about#company">회사소개</Link>
            <Link to="/about#mentors">강사소개</Link>
            <Link to="/corporate">기업교육</Link>
            <Link to="/community">커뮤니티</Link>
          </div>
          <div className="foot__col">
            <h5>고객지원</h5>
            <Link to="/community#notice">공지사항</Link>
            <Link to="/community#qna">Q&amp;A</Link>
            <Link to="#">1:1 문의</Link>
            <Link to="/corporate#proposal">제휴 · 제안 문의</Link>
          </div>
        </div>
        <div className="foot__bot">
          <div>© 2026 DreamIT BIZ Co., Ltd. 드림아이티비즈 · 대표 김드림 · 사업자등록번호 000-00-00000</div>
          <div>서울특별시 강남구 테헤란로 000 · contact@dreamitbiz.co.kr</div>
        </div>
      </div>
    </footer>
  )
}
