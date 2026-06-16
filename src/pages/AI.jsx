import { Link } from 'react-router-dom'

export default function AI() {
  return (
    <main>
      <section className="phero">
        <div className="phero__bgword">AI</div>
        <div className="wrap phero__inner">
          <div className="crumb"><Link to="/">HOME</Link><span className="sep">/</span><span>AI 활용</span></div>
          <h1>AI UTILIZATION<span className="kr">AI로 일하는 방식을 바꿉니다</span></h1>
          <p className="phero__sub">ChatGPT, Claude, Copilot부터 생성형 AI 실무까지. 업무 자동화와 AI 기반 개발 역량을 빠르게 키우세요.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="shead">
            <div>
              <span className="shead__eyebrow mono-label">AI Tracks</span>
              <h2><span className="kr">AI 활용 트랙</span>LEARN AI NOW</h2>
            </div>
          </div>
          <div className="cats">
            {[
              { no: '01', title: 'ChatGPT 업무 자동화', desc: '프롬프트 엔지니어링부터 업무 자동화 실전까지' },
              { no: '02', title: '생성형 AI 개발', desc: 'LangChain, RAG, 에이전트 구축 실무' },
              { no: '03', title: 'AI 코딩 어시스턴트', desc: 'GitHub Copilot, Claude Code 활용 개발 워크플로우' },
              { no: '04', title: 'AI 이미지 · 영상', desc: 'Midjourney, Sora 등 생성 AI 크리에이티브 실무' },
            ].map(item => (
              <div key={item.no} className="cat">
                <div><div className="cat__no">{item.no}</div></div>
                <div><h3>{item.title}</h3><p>{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
