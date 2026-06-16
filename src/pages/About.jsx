import { Link } from 'react-router-dom'

export default function About() {
  return (
    <main>
      <section className="phero" id="company">
        <div className="phero__bgword">ABOUT</div>
        <div className="wrap phero__inner">
          <div className="crumb"><Link to="/">HOME</Link><span className="sep">/</span><span>ABOUT</span></div>
          <h1>WHO WE ARE<span className="kr">배움이 곧 커리어가 되는 곳</span></h1>
          <p className="phero__sub">드림아이티비즈는 누구나, 어디서나, 자신의 속도로 IT 역량을 키울 수 있어야 한다고 믿습니다. 2014년 작은 코딩 강의로 시작해 지금은 <em>15만 명의 커리어가 시작된 곳</em>이 되었습니다.</p>
        </div>
      </section>

      <section className="section" id="mentors">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">Our Team</span>
              <h2><span className="kr">강사진 소개</span>MEET THE MENTORS</h2>
            </div>
          </div>
          <div className="tutors">
            {[
              { img: '/rest06/assets/tutors/t1.png', tag: '10년차 풀스택', name: '김재현', role: '웹 · 앱 개발 트랙', desc: '前 대형 IT기업 시니어 엔지니어. 누적 수강생 4.2만.' },
              { img: '/rest06/assets/tutors/t2.png', tag: '자격증 만점', name: '이수민', role: 'IT 국가자격증 트랙', desc: '정보처리기사·SQLD 만점 합격. 합격률 92% 비결.' },
              { img: '/rest06/assets/tutors/t3.png', tag: 'AI 리서처', name: '박도윤', role: '데이터 · AI 트랙', desc: 'ML 엔지니어 출신. 실무 데이터 프로젝트 다수 리드.' },
              { img: '/rest06/assets/tutors/t4.png', tag: '오피스 전문', name: '최하영', role: '컴퓨터 활용 트랙', desc: '기업 실무 교육 12년. 자동화 엑셀의 모든 것.' },
            ].map(t => (
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

      <section className="section section--alt" id="location">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">Location</span>
              <h2><span className="kr">오시는 길</span>FIND US</h2>
            </div>
          </div>
          <div className="icards icards--3">
            <div className="icard">
              <h3>본사 · 강남캠퍼스</h3>
              <p>서울특별시 강남구 테헤란로 000<br/>드림아이티타워 3층</p>
            </div>
            <div className="icard">
              <h3>교통편</h3>
              <p>2호선 강남역 3번 출구 도보 5분<br/>신분당선 강남역 6번 출구 도보 3분</p>
            </div>
            <div className="icard">
              <h3>운영 시간</h3>
              <p>평일 09:00 – 18:00<br/>주말·공휴일 휴무</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
