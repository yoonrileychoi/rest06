/* DreamIT BIZ — shared site chrome (header + dropdown nav + footer + palette popover).
   Each page sets `window.SITE_PAGE = { active: 'home'|'about'|..., hero: true|false }`
   then includes this script. Fills #site-header and #site-footer placeholders. */
(function () {
  "use strict";
  var HOME = "DreamIT BIZ.html";
  var PAGE = window.SITE_PAGE || { active: "home", hero: false };

  var MENU = [
    { key: "about", label: "About", href: "about.html",
      sub: [["회사소개", "about.html#company"], ["강사소개", "about.html#mentors"], ["오시는 길", "about.html#location"]] },
    { key: "courses", label: "강의", href: "courses.html",
      sub: [["온라인 강의", "courses.html#online"], ["오프라인 강의", "courses.html#offline"]] },
    { key: "corporate", label: "기업교육", href: "corporate.html",
      sub: [["교육 제안", "corporate.html#proposal"], ["강의 내역", "corporate.html#history"]] },
    { key: "certs", label: "자격증", href: "certifications.html",
      sub: [["AWS", "certifications.html#aws"], ["SQLD", "certifications.html#sqld"], ["정보처리기사", "certifications.html#info"], ["컴퓨터활용능력", "certifications.html#comp"]] },
    { key: "ai", label: "AI 활용", href: "ai.html" },
    { key: "community", label: "커뮤니티", href: "community.html" }
  ];

  var caret = '<svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';

  function navLinks() {
    return MENU.map(function (m) {
      var on = m.key === PAGE.active ? " active" : "";
      if (!m.sub) return '<a class="nlink' + on + '" href="' + m.href + '">' + m.label + "</a>";
      var items = m.sub.map(function (s) { return '<a href="' + s[1] + '">' + s[0] + "</a>"; }).join("");
      return '<div class="has-sub">' +
        '<a class="nlink' + on + '" href="' + m.href + '">' + m.label + caret + "</a>" +
        '<div class="dropdown"><div class="dropdown__inner">' + items + "</div></div></div>";
    }).join("");
  }

  var arrow = '<svg class="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  function header() {
    return '<header class="nav' + (PAGE.hero ? " on-hero" : " float") + '">' +
      '<div class="wrap nav__inner">' +
        '<a href="' + HOME + '" class="brand"><span class="dot">D</span>Dream<b>IT</b></a>' +
        '<nav class="nav__links">' + navLinks() + "</nav>" +
        '<div class="nav__right">' +
          '<a href="#" class="nav__cta--ghost">로그인</a>' +
          '<div class="nav__tools">' +
            '<button class="ntool palette-btn" id="paletteBtn" title="컬러 테마" aria-label="컬러 팔레트 선택" aria-haspopup="true">' +
              '<span class="pal-swatch"><i class="a"></i><i class="b"></i></span><span class="cap">테마</span></button>' +
            '<button class="ntool mode-btn" id="modeBtn" title="다크 / 라이트 모드" aria-label="다크/라이트 모드 전환">' +
              '<svg class="ic-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
              '<svg class="ic-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"/></svg>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</div></header>" +
      '<div class="palette-pop" id="palettePop" hidden><h6>컬러 테마 · Color Theme</h6><div class="pal-grid" id="palGrid"></div></div>';
  }

  function footer() {
    return '<footer class="foot" data-screen-label="Footer"><div class="wrap">' +
      '<div class="foot__top">' +
        '<div><a href="' + HOME + '" class="brand"><span class="dot">D</span>Dream<b>IT</b></a>' +
          '<p class="foot__intro">코딩, 자격증, AI까지 — 12만 수강생이 선택한 실무 중심 온라인 IT 교육 플랫폼.</p></div>' +
        '<div class="foot__col"><h5>강의</h5><a href="courses.html#online">온라인 강의</a><a href="courses.html#offline">오프라인 강의</a><a href="certifications.html">자격증 과정</a><a href="ai.html">AI 활용</a></div>' +
        '<div class="foot__col"><h5>회사</h5><a href="about.html#company">회사소개</a><a href="about.html#mentors">강사소개</a><a href="corporate.html">기업교육</a><a href="community.html">커뮤니티</a></div>' +
        '<div class="foot__col"><h5>고객지원</h5><a href="community.html#notice">공지사항</a><a href="community.html#qna">Q&amp;A</a><a href="#">1:1 문의</a><a href="corporate.html#proposal">제휴 · 제안 문의</a></div>' +
      "</div>" +
      '<div class="foot__bot"><div>© 2026 DreamIT BIZ Co., Ltd. 드림아이티비즈 · 대표 김드림 · 사업자등록번호 000-00-00000</div>' +
        "<div>서울특별시 강남구 테헤란로 000 · contact@dreamitbiz.co.kr</div></div>" +
      "</div></footer>";
  }

  function mount(id, html, where) {
    var ph = document.getElementById(id);
    if (ph) { ph.outerHTML = html; return; }
    document.body.insertAdjacentHTML(where, html);
  }

  mount("site-header", header(), "afterbegin");
  mount("site-footer", footer(), "beforeend");
})();
