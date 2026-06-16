/* DreamIT BIZ — Tweaks island.
   Color palette + dark/light now live in the top nav (palette.js).
   This panel handles motion, headline tone, and corner radius. */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "radius": "soft",
  "motion": true,
  "headline": "bold"
}/*EDITMODE-END*/;

const HEADLINES = {
  bold: {
    hero: '<span class="kr">코딩, 자격증,</span><span class="kr">커리어까지</span><span class="kr"><em>한 번에</em></span>',
    heroSub: '취준생부터 현직 개발자, 기업 교육까지 — 12만 수강생이 선택한 실무 중심 온라인 IT 교육 플랫폼, 드림아이티비즈.',
    cta: '<span class="kr">지금, 코딩을</span>START TODAY'
  },
  friendly: {
    hero: '<span class="kr">누구나 쉽게,</span><span class="kr">오늘부터 <em>개발 시작</em></span>',
    heroSub: 'IT가 처음이어도 괜찮아요. 쉬운 입문 강의부터 1:1 멘토링까지, 끝까지 함께 가는 온라인 학습 친구 드림아이티비즈.',
    cta: '<span class="kr">함께 시작해요</span>LET\u2019S GO'
  }
};

const RADII = {
  sharp: ["4px", "6px"],
  soft:  ["18px", "28px"],
  round: ["28px", "40px"]
};

function applyTweaks(t) {
  const root = document.documentElement;
  root.setAttribute("data-motion", t.motion ? "on" : "off");

  const r = RADII[t.radius] || RADII.soft;
  root.style.setProperty("--radius", r[0]);
  root.style.setProperty("--radius-lg", r[1]);

  const h = HEADLINES[t.headline] || HEADLINES.bold;
  const heroT = document.getElementById("heroTitle");
  const heroS = document.getElementById("heroSub");
  const ctaT  = document.getElementById("ctaTitle");
  if (heroT) heroT.innerHTML = h.hero;
  if (heroS) heroS.textContent = h.heroSub;
  if (ctaT)  ctaT.innerHTML = h.cta;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="스타일" />
      <TweakRadio label="모서리" value={t.radius}
        options={[{value:"sharp",label:"각짐"},{value:"soft",label:"기본"},{value:"round",label:"둥글게"}]}
        onChange={(v) => setTweak("radius", v)} />

      <TweakSection label="콘텐츠 · 모션" />
      <TweakRadio label="헤드라인 톤" value={t.headline}
        options={[{value:"bold",label:"대담"},{value:"friendly",label:"친근"}]}
        onChange={(v) => setTweak("headline", v)} />
      <TweakToggle label="스크롤 애니메이션" value={t.motion}
        onChange={(v) => setTweak("motion", v)} />
    </TweaksPanel>
  );
}

// apply default tweaks immediately, before the panel is ever opened
applyTweaks(TWEAK_DEFAULTS);

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
