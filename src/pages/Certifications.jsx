import { Link } from 'react-router-dom'

const CERTS = [
  { id: 'aws', title: 'AWS 클라우드', items: ['AWS Solutions Architect', 'AWS Developer', 'AWS SysOps', 'AWS Cloud Practitioner'] },
  { id: 'sqld', title: 'SQLD / SQLP', items: ['SQLD 합격 완성반', 'SQLP 심화 과정', 'DB 실무 연계 트랙'] },
  { id: 'info', title: '정보처리기사', items: ['필기 완성반', '실기 완성반', '필기+실기 묶음반', '기출 집중 단기반'] },
  { id: 'comp', title: '컴퓨터활용능력', items: ['1급 완성반', '2급 완성반', '스프레드시트 집중', '데이터베이스 집중'] },
]

export default function Certifications() {
  return (
    <main>
      <section className="phero">
        <div className="phero__bgword">CERT</div>
        <div className="wrap phero__inner">
          <div className="crumb"><Link to="/">HOME</Link><span className="sep">/</span><span>자격증</span></div>
          <h1>CERTIFICATIONS<span className="kr">국가공인 자격증 합격률 92%</span></h1>
          <p className="phero__sub">AWS, SQLD, 정보처리기사, 컴퓨터활용능력까지 — 합격 보장 시스템과 기출 분석으로 빠르게 취득하세요.</p>
        </div>
      </section>

      {CERTS.map(cert => (
        <section key={cert.id} className="section" id={cert.id}>
          <div className="wrap">
            <div className="shead">
              <div>
                <span className="shead__eyebrow mono-label">Certification</span>
                <h2><span className="kr">{cert.title}</span>{cert.id.toUpperCase()}</h2>
              </div>
            </div>
            <div className="icards icards--4">
              {cert.items.map(item => (
                <div key={item} className="icard">
                  <h3>{item}</h3>
                  <p>기출 분석 · 합격 보장 시스템 적용</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  )
}
