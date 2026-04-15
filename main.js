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

    /* ── Scroll: Header schrumpfen ── */
    var header = document.getElementById('hs-header');
    if (header) {
      function onScroll() {
        if (window.scrollY > 10) {
          header.classList.add('is-scrolled');
        } else {
          header.classList.remove('is-scrolled');
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll(); /* Initialzustand setzen */
    }
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

    /* Alle drei möglichen Auslöser registrieren */
    ['impr-open-btn', 'impr-open-btn-col', 'impr-open-btn-2'].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener('click', openImpr);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeImpr);

    /* Klick auf Hintergrund schließt */
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeImpr();
      });
    }

    /* Escape schließt */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeImpr();
    });

    /* ── Cookie-Einstellungen erneut öffnen ── */
    var reopenBtn = document.getElementById('hs-cookie-reopen-btn');
    if (reopenBtn) {
      reopenBtn.addEventListener('click', function () {
        if (typeof window.reopenCookieBanner === 'function') window.reopenCookieBanner();
      });
    }
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
     4. COOKIE-BANNER
     ============================================================ */

  /**
   * Initialisiert den Cookie-Banner.
   * Aufrufen nachdem cookie-banner.html ins DOM eingefügt wurde.
   *
   * Gespeicherte Einwilligungen (localStorage):
   *   hs_consent_status  – 'accepted' | 'rejected' | 'custom'
   *   hs_consent_maps    – 'true' | 'false'
   */
  function initCookieBanner() {

    /* ── Elemente ── */
    var banner        = document.getElementById('hs-cookie-banner');
    var overlay       = document.getElementById('hs-cookie-overlay');
    var catMaps       = document.getElementById('hs-cat-maps');

    var btnAcceptAll  = document.getElementById('hs-cb-accept-all');
    var btnRejectAll  = document.getElementById('hs-cb-reject-all');
    var btnSettings   = document.getElementById('hs-cb-open-settings');
    var btnModalClose = document.getElementById('hs-cookie-modal-close');
    var btnModalSave  = document.getElementById('hs-modal-save');
    var btnModalReject= document.getElementById('hs-modal-reject-all');

    if (!banner) return;

    /* ── Einwilligung lesen / schreiben ── */
    function getConsent()    { return localStorage.getItem('hs_consent_status'); }
    function getMapsConsent(){ return localStorage.getItem('hs_consent_maps') === 'true'; }

    function saveConsent(status, maps) {
      localStorage.setItem('hs_consent_status', status);
      localStorage.setItem('hs_consent_maps',   String(maps));
      hideBanner();
      closeModal();
      applyConsent(maps);
    }

    /* ── Banner anzeigen / verstecken ── */
    function showBanner() { if (banner) banner.classList.add('is-visible'); }
    function hideBanner() { if (banner) banner.classList.remove('is-visible'); }

    /* ── Modal öffnen / schließen ── */
    function openModal() {
      if (!overlay) return;
      /* Aktuellen Stand in Toggles spiegeln */
      if (catMaps) catMaps.checked = getMapsConsent();
      overlay.classList.add('is-open');
    }
    function closeModal() {
      if (overlay) overlay.classList.remove('is-open');
    }

    /* ── Einwilligung anwenden ── */
    function applyConsent(maps) {
      /* Globales Event auslösen – Google Maps kann darauf lauschen */
      var event = new CustomEvent('hs:consent', { detail: { maps: maps } });
      document.dispatchEvent(event);
    }

    /* ── Initialisierung ── */
    var status = getConsent();
    if (!status) {
      /* Noch keine Entscheidung → Banner zeigen */
      showBanner();
    } else {
      /* Bereits entschieden → direkt anwenden */
      applyConsent(getMapsConsent());
    }

    /* ── Event-Listener: Banner ── */
    if (btnAcceptAll) {
      btnAcceptAll.addEventListener('click', function () {
        saveConsent('accepted', true);
      });
    }
    if (btnRejectAll) {
      btnRejectAll.addEventListener('click', function () {
        saveConsent('rejected', false);
      });
    }
    if (btnSettings) {
      btnSettings.addEventListener('click', function () {
        hideBanner();
        openModal();
      });
    }

    /* ── Event-Listener: Modal ── */
    if (btnModalClose) {
      btnModalClose.addEventListener('click', function () {
        closeModal();
        /* Banner wieder zeigen wenn noch keine Entscheidung */
        if (!getConsent()) showBanner();
      });
    }
    if (btnModalSave) {
      btnModalSave.addEventListener('click', function () {
        var maps = catMaps ? catMaps.checked : false;
        saveConsent('custom', maps);
      });
    }
    if (btnModalReject) {
      btnModalReject.addEventListener('click', function () {
        if (catMaps) catMaps.checked = false;
        saveConsent('rejected', false);
      });
    }

    /* Klick auf Overlay-Hintergrund schließt Modal */
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          closeModal();
          if (!getConsent()) showBanner();
        }
      });
    }

    /* Escape schließt Modal */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
        closeModal();
        if (!getConsent()) showBanner();
      }
    });
  }

  /**
   * Cookie-Banner erneut öffnen (z.B. via Footer-Link).
   * Löscht die gespeicherte Entscheidung und zeigt den Banner wieder.
   */
  function reopenCookieBanner() {
    localStorage.removeItem('hs_consent_status');
    localStorage.removeItem('hs_consent_maps');
    var banner = document.getElementById('hs-cookie-banner');
    if (banner) banner.classList.add('is-visible');
  }


  /* ============================================================
     5. EINSTIEGSPUNKT
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

  /* Public API */
  window.initHeader        = initHeader;
  window.initFooter        = initFooter;
  window.initFaq           = initFaq;
  window.initCookieBanner  = initCookieBanner;
  window.reopenCookieBanner= reopenCookieBanner;

  /* Automatischer Start */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
