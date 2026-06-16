/* DreamIT BIZ — inner page interactions: accordion, sticky tab highlight,
   anchor-scroll offset for the fixed header. */
(function () {
  "use strict";

  function initAccordion() {
    document.querySelectorAll(".acc__q").forEach(function (q) {
      q.addEventListener("click", function () {
        var item = q.closest(".acc__item");
        var open = item.classList.contains("open");
        // optional: close siblings within same .acc
        item.closest(".acc").querySelectorAll(".acc__item.open").forEach(function (o) {
          if (o !== item) o.classList.remove("open");
        });
        item.classList.toggle("open", !open);
      });
    });
  }

  function initTabs() {
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab[data-target]"));
    if (!tabs.length) return;
    var targets = tabs.map(function (t) { return document.getElementById(t.getAttribute("data-target")); });

    tabs.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        var el = document.getElementById(t.getAttribute("data-target"));
        if (el) {
          var y = el.getBoundingClientRect().top + window.scrollY - 132;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      });
    });

    function onScroll() {
      var pos = window.scrollY + 160;
      var current = tabs[0];
      for (var i = 0; i < targets.length; i++) {
        if (targets[i] && targets[i].offsetTop <= pos) current = tabs[i];
      }
      tabs.forEach(function (t) { t.classList.toggle("on", t === current); });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* offset in-page anchor jumps so the fixed header doesn't cover the target */
  function initAnchorOffset() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href").slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      var y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: "smooth" });
      history.replaceState(null, "", "#" + id);
    });
    // honor a hash on load (after layout)
    if (location.hash.length > 1) {
      setTimeout(function () {
        var el = document.getElementById(location.hash.slice(1));
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: "auto" });
      }, 120);
    }
  }

  function init() { initAccordion(); initTabs(); initAnchorOffset(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
