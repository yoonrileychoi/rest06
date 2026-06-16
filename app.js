/* DreamIT BIZ — interactions: scroll reveal, count-up, nav, marquee.
   Uses getBoundingClientRect + scroll/resize (not IntersectionObserver) so
   reveals fire reliably on first paint in every environment. */
(function () {
  "use strict";

  var revealEls = [];
  var countEls = [];

  /* ---- staggered reveal setup ---- */
  function setupReveal() {
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var step = parseInt(group.getAttribute("data-stagger"), 10) || 80;
      group.querySelectorAll("[data-reveal]").forEach(function (k, i) {
        k.style.setProperty("--d", (i * step) + "ms");
      });
    });
    revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  }

  /* ---- count up ---- */
  function fmt(v, d) {
    return v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function animateCount(el) {
    if (el.__done) return;
    el.__done = true;
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var dur = 1600, start = null;
    if (document.documentElement.getAttribute("data-motion") === "off") {
      el.textContent = fmt(target, dec); return;
    }
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, dec);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = fmt(target, dec);
    }
    requestAnimationFrame(tick);
  }

  /* ---- unified scroll check ---- */
  function check() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var trigger = vh * 0.92;
    if (revealEls.length) {
      revealEls = revealEls.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < trigger && r.bottom > 0) { el.classList.add("in"); return false; }
        return true;
      });
    }
    if (countEls.length) {
      countEls = countEls.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.85 && r.bottom > 0) { animateCount(el); return false; }
        return true;
      });
    }
  }

  /* ---- nav state ---- */
  function initNav() {
    var nav = document.querySelector(".nav");
    var hero = document.querySelector(".hero, .phero");
    if (!nav) return;
    window.__navScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      var heroH = hero ? hero.offsetHeight - 90 : 400;
      nav.classList.toggle("float", y > 40);
      nav.classList.toggle("on-hero", y < heroH);
    };
    window.__navScroll();
  }

  /* ---- marquee duplicate ---- */
  function initMarquee() {
    document.querySelectorAll(".marquee__track").forEach(function (tr) {
      if (tr.dataset.dup) return;
      tr.dataset.dup = "1";
      tr.innerHTML = tr.innerHTML + tr.innerHTML;
    });
  }

  /* ---- reconcile: if the animation clock didn't advance (capture tools,
     no-anim contexts), drop transitions so revealed content shows, and
     finalize counters that never got to run ---- */
  function reconcile() {
    var sample = document.querySelector("[data-reveal].in");
    var stuck = sample && parseFloat(getComputedStyle(sample).opacity) < 0.5;
    if (!stuck) return;
    document.documentElement.classList.add("no-anim");
    document.querySelectorAll("[data-count]").forEach(function (el) {
      el.__done = true;
      el.textContent = fmt(parseFloat(el.getAttribute("data-count")),
                           parseInt(el.getAttribute("data-dec") || "0", 10));
    });
  }

  function onScroll() { check(); if (window.__navScroll) window.__navScroll(); }

  function init() {
    initMarquee();
    setupReveal();
    countEls = Array.prototype.slice.call(document.querySelectorAll("[data-count]"));
    initNav();
    check();
    // a couple of deferred passes in case layout/fonts shift first paint
    requestAnimationFrame(check);
    setTimeout(check, 300);
    setTimeout(reconcile, 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.__dreamit = { check: check };
})();
