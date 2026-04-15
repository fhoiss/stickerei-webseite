/**
 * main.js – Hoiß Stickerei & Textildruck
 * Einbinden via: <script src="/main.js" defer></script>
 *
 * Enthält:
 *   1. initHeader()   – Dropdowns, Hamburger, Mobile-Submenüs, aktiver Menüpunkt
 *   2. initFooter()   – Jahreszahl, Impressum-Overlay
 *   3. init()         – Einstiegspunkt, wartet auf DOM-Ready und auf
 *                       dynamisch nachgeladene Fragmente (header/footer)
 */

(function () {
  'use strict';

  /* ============================================================
     1. HEADER
     ============================================================ */

  /**
   * Initialisiert alle Header-Interaktionen.
   * Wird automatisch aufgerufen sobald das Header-Fragment im DOM ist.
   * Kann auch manuell nach dynamischem Nachladen aufgerufen werden:
   *   fetch('header.html').then(...).then(() => window.initHeader());
   */
  function initHeader() {

    /* ── Desktop-Dropdowns ── */
    function makeDropdown(itemId) {
      var item = document.getElementById(itemId);
      if (!item) return;
      var btn = item.querySelector('.hs-nav__link');

      function open() {
        item.classList.add('hs-nav__item--open');
        if (btn) btn.setAttribute('aria-expanded', 'true');
      }
      function close() {
        item.classList.remove('hs-nav__item--open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);

      if (btn) {
        btn.addEventListener('click', function () {
          item.classList.contains('hs-nav__item--open') ? close() : open();
        });
      }

      document.addEventListener('click', function (e) {
        if (!item.contains(e.target)) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });
    }

    makeDropdown('nav-textildruck');
    makeDropdown('nav-loesungen');

    /* ── Hamburger (Mobile Nav öffnen/schließen) ── */
    var hbg = document.getElementById('hs-hamburger');
    var mob = document.getElementById('hs-mobile-nav');

    if (hbg && mob) {
      hbg.addEventListener('click', function () {
        var open = mob.classList.toggle('is-open');
        hbg.classList.toggle('is-open', open);
        hbg.setAttribute('aria-expanded', String(open));
        hbg.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      });
    }

    /* ── Mobile Submenüs ── */
    function makeMobSub(btnId, subId, arrId) {
      var btn = document.getElementById(btnId);
      var sub = document.getElementById(subId);
      var arr = document.getElementById(arrId);
      if (!btn || !sub) return;

      btn.addEventListener('click', function () {
        var open = sub.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        if (arr) arr.classList.toggle('is-open', open);
      });
    }

    makeMobSub('mob-druck-btn', 'mob-druck-sub', 'mob-druck-arr');
    makeMobSub('mob-loes-btn',  'mob-loes-sub',  'mob-loes-arr');

    /* ── Aktiven Menüpunkt markieren ── */
    var path = window.location.pathname;
    document.querySelectorAll('.hs-nav__link[href]').forEach(function (link) {
      if (link.getAttribute('href') === path) {
        link.classList.add('hs-nav__link--active');
      }
    });
  }


  /* ============================================================
     2. FOOTER
     ============================================================ */

  /**
   * Initialisiert alle Footer-Interaktionen.
   * Wird automatisch aufgerufen sobald das Footer-Fragment im DOM ist.
   * Kann auch manuell nach dynamischem Nachladen aufgerufen werden:
   *   fetch('footer.html').then(...).then(() => window.initFooter());
   */
  function initFooter() {

    /* ── Jahreszahl automatisch aktuell halten ── */
    var yr = document.getElementById('hs-year');
    if (yr) yr.textContent = new Date().getFullYear();

    /* ── Impressum-Overlay ── */
    var overlay  = document.getElementById('hs-impr-overlay');
    var closeBtn = document.getElementById('hs-impr-close');

    function openImpr(e) {
      e.preventDefault();
      if (overlay) overlay.classList.add('is-open');
    }
    function closeImpr() {
      if (overlay) overlay.classList.remove('is-open');
    }

    var btn1 = document.getElementById('impr-open-btn');
    var btn2 = document.getElementById('impr-open-btn-2');
    if (btn1) btn1.addEventListener('click', openImpr);
    if (btn2) btn2.addEventListener('click', openImpr);
    if (closeBtn) closeBtn.addEventListener('click', closeImpr);

    /* Klick auf Overlay-Hintergrund schließt */
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeImpr();
      });
    }

    /* Escape schließt */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeImpr();
    });
  }


  /* ============================================================
     3. FAQ-AKKORDEON
     ============================================================ */

  /**
   * Initialisiert alle FAQ-Akkordeons auf der Seite.
   * Funktioniert für beliebig viele .faq__item Elemente.
   */
  function initFaq() {
    var items = document.querySelectorAll('.faq__item');
    if (!items.length) return;

    items.forEach(function (item) {
      var trigger = item.querySelector('.faq__trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function () {
        var isOpen = item.classList.contains('faq__item--open');

        /* Alle anderen schließen (Akkordeon-Verhalten) */
        items.forEach(function (other) {
          other.classList.remove('faq__item--open');
          var t = other.querySelector('.faq__trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        /* Geklicktes Item toggeln */
        if (!isOpen) {
          item.classList.add('faq__item--open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }


  /* ============================================================
     4. EINSTIEGSPUNKT
     ============================================================ */

  /**
   * Wartet auf DOMContentLoaded und initialisiert Header, Footer & FAQ.
   *
   * Bei statisch eingebettetem Header/Footer (z.B. PHP include):
   *   → alles läuft automatisch.
   *
   * Bei dynamisch nachgeladenem Header/Footer (fetch + innerHTML):
   *   → nach dem Einfügen ins DOM manuell aufrufen:
   *       window.initHeader();
   *       window.initFooter();
   */
  function init() {
    initHeader();
    initFooter();
    initFaq();
  }

  /* Public API – erreichbar für dynamisches Nachladen */
  window.initHeader = initHeader;
  window.initFooter = initFooter;
  window.initFaq    = initFaq;

  /* Automatischer Start */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
