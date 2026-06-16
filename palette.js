/* DreamIT BIZ — top-menu palette picker + dark/light toggle.
   Palettes are separate CSS files in themes/; switching swaps the
   <link id="paletteCss"> href. Mode toggles html.dark. Both persist. */
(function () {
  "use strict";

  var PALETTES = [
    { id: "navygold", name: "다크블루 · 골드", p: "#1C2C5A", s: "#F2B829" },
    { id: "meritz",   name: "레드 · 네이비",   p: "#C42E3C", s: "#1B2A57" },
    { id: "forest",   name: "포레스트 · 샌드", p: "#1F4E3D", s: "#E0B252" },
    { id: "charcoal", name: "차콜 · 코랄",     p: "#2A3540", s: "#E0694B" },
    { id: "teal",     name: "틸 · 클레이",     p: "#155E63", s: "#D98B5F" },
    { id: "plum",     name: "플럼 · 블러시",   p: "#4A2A47", s: "#DD8298" },
    { id: "slate",    name: "슬레이트 · 스카이", p: "#2E3A59", s: "#5B8FB0" },
    { id: "burgundy", name: "버건디 · 카멜",   p: "#6E1F2E", s: "#C99A5B" }
  ];
  var PKEY = "dreamit-palette", MKEY = "dreamit-mode", DEFAULT = "navygold";

  function getPalette() {
    try { return localStorage.getItem(PKEY) || DEFAULT; } catch (e) { return DEFAULT; }
  }
  function setPaletteLink(id) {
    var link = document.getElementById("paletteCss");
    if (link) link.setAttribute("href", "themes/" + id + ".css");
  }
  function applyPalette(id, save) {
    if (!PALETTES.some(function (p) { return p.id === id; })) id = DEFAULT;
    setPaletteLink(id);
    if (save) { try { localStorage.setItem(PKEY, id); } catch (e) {} }
    document.querySelectorAll(".pal-opt").forEach(function (el) {
      el.setAttribute("data-on", el.getAttribute("data-pal") === id ? "1" : "0");
    });
  }
  function applyMode(dark, save) {
    document.documentElement.classList.toggle("dark", !!dark);
    if (save) { try { localStorage.setItem(MKEY, dark ? "dark" : "light"); } catch (e) {} }
  }

  function buildPopover() {
    var grid = document.getElementById("palGrid");
    if (!grid) return;
    grid.innerHTML = "";
    PALETTES.forEach(function (pal) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "pal-opt"; b.setAttribute("data-pal", pal.id);
      b.innerHTML =
        '<span class="sw"><i style="background:' + pal.p + '"></i><i style="background:' + pal.s + '"></i></span>' +
        '<span class="nm">' + pal.name + "</span>";
      b.addEventListener("click", function () {
        applyPalette(pal.id, true);
        closePop();
      });
      grid.appendChild(b);
    });
  }

  var popEl, btnEl, hoverTimer = null;
  function openPop() { if (popEl) { clearTimeout(hoverTimer); popEl.hidden = false; requestAnimationFrame(function(){ popEl.classList.add("open"); }); document.addEventListener("click", outside, true); } }
  function closePop() { if (popEl) { popEl.classList.remove("open"); document.removeEventListener("click", outside, true); setTimeout(function(){ if(popEl && !popEl.classList.contains("open")) popEl.hidden = true; }, 220); } }
  function outside(e) { if (popEl && !popEl.contains(e.target) && btnEl && !btnEl.contains(e.target)) closePop(); }
  function scheduleClose() { clearTimeout(hoverTimer); hoverTimer = setTimeout(closePop, 220); }
  function cancelClose() { clearTimeout(hoverTimer); }

  function init() {
    btnEl = document.getElementById("paletteBtn");
    popEl = document.getElementById("palettePop");
    buildPopover();
    applyPalette(getPalette(), false);

    if (btnEl) btnEl.addEventListener("click", function (e) {
      e.stopPropagation();
      if (popEl.hidden) openPop(); else closePop();
    });

    // open on hover, close shortly after the cursor leaves both button and popover
    if (btnEl && popEl) {
      btnEl.addEventListener("mouseenter", openPop);
      btnEl.addEventListener("mouseleave", scheduleClose);
      popEl.addEventListener("mouseenter", cancelClose);
      popEl.addEventListener("mouseleave", scheduleClose);
    }

    var mode = document.getElementById("modeBtn");
    if (mode) mode.addEventListener("click", function () {
      applyMode(!document.documentElement.classList.contains("dark"), true);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.__palette = { applyPalette: applyPalette, applyMode: applyMode };
})();
