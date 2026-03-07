// ========================================
// COMPONENT LOADER
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initializeNavigation();
    initializeCookieBanner();
});

function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;
    
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            headerPlaceholder.innerHTML = html;
            initializeNavigation();
        })
        .catch(error => console.error('❌ Header konnte nicht geladen werden:', error));
}

function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;
    
    fetch('footer.html')
        .then(response => response.text())
        .then(html => {
            footerPlaceholder.innerHTML = html;
            initializeCookieBanner();
        })
        .catch(error => console.error('❌ Footer konnte nicht geladen werden:', error));
}

// ========================================
// MOBILE NAVIGATION TOGGLE
// ========================================
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
    
    // Dropdown Menus
    const dropdowns = document.querySelectorAll('.nav-dropdown-toggle');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            const dropdownMenu = this.closest('.nav-dropdown')?.querySelector('.nav-dropdown-menu');
            if (dropdownMenu) {
                dropdownMenu.classList.toggle('active');
            }
        });
    });
    
    // Mobile: Menü schließen beim Klick auf Link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// ========================================
// COOKIE BANNER
// ========================================
function initializeCookieBanner() {
    const cookieModal = document.getElementById('cookie-modal');
    if (!cookieModal) return;
    
    // Überprüfe ob Cookie-Entscheidung bereits getroffen wurde
    if (!localStorage.getItem('cookie-consent')) {
        setTimeout(() => {
            cookieModal.style.display = 'flex';
            console.log('🍪 Cookie Banner angezeigt');
        }, 1000);
    } else {
        console.log('✅ Cookie Consent bereits vorhanden');
    }
    
    // Save Settings Button
    const saveBtn = document.getElementById('cookie-save-settings');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const analyticsCookie = document.getElementById('cookie-toggle-analytics')?.checked || false;
            const marketingCookie = document.getElementById('cookie-toggle-marketing')?.checked || false;
            
            localStorage.setItem('cookie-consent', JSON.stringify({
                analytics: analyticsCookie,
                marketing: marketingCookie,
                timestamp: new Date().getTime()
            }));
            
            cookieModal.style.display = 'none';
            console.log('✅ Cookie Einstellungen gespeichert', {
                analytics: analyticsCookie,
                marketing: marketingCookie
            });
        });
    }
    
    // Decline Button
    const declineBtn = document.getElementById('cookie-modal-close');
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            localStorage.setItem('cookie-consent', JSON.stringify({
                analytics: false,
                marketing: false,
                timestamp: new Date().getTime()
            }));
            cookieModal.style.display = 'none';
            console.log('❌ Cookies abgelehnt');
        });
    }
}

// ========================================
// LIGHTBOX GALLERY
// ========================================
window.openLightbox = function(src, alt) {
    var lightbox = document.getElementById('myLightbox');
    var img = document.getElementById('lightboxImg');
    if (lightbox && img) {
        img.src = src;
        img.alt = alt;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('🖼️ Lightbox geöffnet:', alt);
    }
}

window.closeLightbox = function() {
    var lightbox = document.getElementById('myLightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('🖼️ Lightbox geschlossen');
    }
}

// ESC zum Schließen des Lightbox
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        window.closeLightbox();
    }
});

// ========================================
// UTILITY: SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// CONSOLE LOGGING
// ========================================
console.log('%c🚀 Hoiß Stickerei Website geladen', 'color: #ef8006; font-size: 16px; font-weight: bold;');
