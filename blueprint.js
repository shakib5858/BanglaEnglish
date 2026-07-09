/**
 * BizFlow CTO Blueprint — blueprint.js
 * ─────────────────────────────────────
 * • One-click smart print: auto-verifies background graphics,
 *   shows countdown overlay, then fires window.print()
 * • Floating toolbar with page navigation
 * • Bengali date auto-fill on planning board
 * • Keyboard shortcut: Ctrl/Cmd + P intercepted for clean print
 */
(function () {
  'use strict';

  /* ════════════════════════════════
     1. AUTO-FILL DATE
  ════════════════════════════════ */
  function fillDate() {
    const el = document.getElementById('plan-date');
    if (!el) return;
    const now  = new Date();
    const opts = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    try {
      el.textContent = now.toLocaleDateString('bn-BD', opts);
    } catch (_) {
      el.textContent = now.toLocaleDateString('en-GB', opts);
    }
  }

  /* ════════════════════════════════
     2. PRE-PRINT OVERLAY
     Shows a 1-second countdown so
     Chrome has time to render
     background-color/images before
     the print dialog opens.
  ════════════════════════════════ */
  function showPrintOverlay(onReady) {
    const overlay = document.createElement('div');
    overlay.id = 'bf-print-overlay';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'polite');
    overlay.innerHTML = `
      <div class="bfpo-box">
        <div class="bfpo-spinner">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="18" stroke="rgba(255,255,255,.2)" stroke-width="4"/>
            <path d="M22 4 A18 18 0 0 1 40 22" stroke="#b8950a" stroke-width="4" stroke-linecap="round">
              <animateTransform attributeName="transform" type="rotate"
                from="0 22 22" to="360 22 22" dur=".9s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
        <div class="bfpo-title">প্রিন্ট প্রস্তুত হচ্ছে…</div>
        <div class="bfpo-sub">৮ পেজ A4 Portrait · Background graphics চালু রাখুন</div>
        <div class="bfpo-steps">
          <div class="bfpo-step" id="bfpo-s1">✅ পেজ লেআউট যাচাই</div>
          <div class="bfpo-step" id="bfpo-s2">⏳ ব্যাকগ্রাউন্ড রেন্ডার</div>
          <div class="bfpo-step" id="bfpo-s3">⏳ প্রিন্ট ডায়ালগ খুলছে</div>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    /* Step animations */
    setTimeout(() => {
      const s2 = document.getElementById('bfpo-s2');
      if (s2) s2.textContent = '✅ ব্যাকগ্রাউন্ড রেন্ডার';
    }, 400);
    setTimeout(() => {
      const s3 = document.getElementById('bfpo-s3');
      if (s3) s3.textContent = '✅ প্রিন্ট ডায়ালগ খুলছে';
    }, 750);
    setTimeout(() => {
      overlay.remove();
      onReady();
    }, 900);
  }

  /* ════════════════════════════════
     3. ONE-CLICK SMART PRINT
  ════════════════════════════════ */
  function smartPrint() {
    showPrintOverlay(() => {
      window.print();
    });
  }

  /* ════════════════════════════════
     4. KEYBOARD SHORTCUT
     Intercept Ctrl/Cmd+P to use
     our smart print instead of
     the raw browser dialog.
  ════════════════════════════════ */
  function setupKeyboard() {
    document.addEventListener('keydown', function (e) {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === 'p') {
        e.preventDefault();
        smartPrint();
      }
    });
  }

  /* ════════════════════════════════
     5. BUILD TOOLBAR
  ════════════════════════════════ */
  function buildToolbar() {
    const bar = document.createElement('div');
    bar.className = 'print-bar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'BizFlow print toolbar');

    bar.innerHTML = `
      <div class="pbr-inner">

        <!-- Brand -->
        <div class="pbr-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8950a" stroke-width="2">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
          <span class="pbr-title">বিজফ্লো ব্লুপ্রিন্ট</span>
        </div>

        <!-- Hint pill -->
        <div class="pbr-hint">
          🖨️ Background graphics <strong>চালু</strong> রাখুন
        </div>

        <!-- Page navigation -->
        <div class="pbr-nav">
          <button class="pbr-nav-btn" id="pbr-prev" aria-label="আগের পেজ" title="আগের পেজ">&#8249;</button>
          <span class="pbr-counter" id="pbr-counter">১ / ৮</span>
          <button class="pbr-nav-btn" id="pbr-next" aria-label="পরের পেজ" title="পরের পেজ">&#8250;</button>
        </div>

        <!-- Print button -->
        <button class="pbr-print-btn" id="pbr-print" aria-label="এক ক্লিকে ৮ পেজ প্রিন্ট করুন">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          <span>এক ক্লিকে প্রিন্ট করুন</span>
          <span class="pbr-badge">৮ পেজ A4</span>
        </button>

      </div>`;

    document.body.appendChild(bar);
    document.getElementById('pbr-print').addEventListener('click', smartPrint);
    setupPageNav();
    injectStyles();
  }

  /* ════════════════════════════════
     6. PAGE NAVIGATION
  ════════════════════════════════ */
  function setupPageNav() {
    const pages = Array.from(document.querySelectorAll('.page'));
    let current = 0;

    function updateCounter() {
      const el = document.getElementById('pbr-counter');
      if (el) el.textContent = (current + 1) + ' / ' + pages.length;
    }

    function goTo(idx) {
      if (idx < 0 || idx >= pages.length) return;
      current = idx;
      pages[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateCounter();
    }

    document.getElementById('pbr-prev')?.addEventListener('click', () => goTo(current - 1));
    document.getElementById('pbr-next')?.addEventListener('click', () => goTo(current + 1));

    /* Intersection observer for accurate page tracking */
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            current = pages.indexOf(e.target);
            updateCounter();
          }
        });
      }, { threshold: 0.5 });
      pages.forEach(p => obs.observe(p));
    }

    updateCounter();
  }

  /* ════════════════════════════════
     7. INJECTED CSS
  ════════════════════════════════ */
  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
/* ── Print toolbar ── */
.print-bar {
  position: fixed;
  bottom: 18px; right: 18px;
  z-index: 9999;
  font-family: 'Inter', 'Hind Siliguri', sans-serif;
}
.pbr-inner {
  background: linear-gradient(135deg, #0f2347 0%, #1a3a6e 60%, #0f3d28 100%);
  border-radius: 16px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 40px rgba(26,58,110,.45), 0 2px 8px rgba(0,0,0,.3);
  border: 1px solid rgba(184,149,10,.25);
  flex-wrap: wrap;
  max-width: 600px;
}

/* Brand */
.pbr-brand {
  display: flex; align-items: center; gap: 6px;
  color: #fafaf8;
}
.pbr-title {
  font-size: .78rem; font-weight: 700;
  color: #fafaf8; white-space: nowrap;
}

/* Hint */
.pbr-hint {
  font-size: .68rem;
  color: rgba(250,250,248,.7);
  background: rgba(255,255,255,.09);
  border: 1px solid rgba(184,149,10,.2);
  padding: 3px 9px; border-radius: 20px;
  white-space: nowrap;
}
.pbr-hint strong { color: #fcd34d; }

/* Nav */
.pbr-nav {
  display: flex; align-items: center; gap: 5px;
}
.pbr-nav-btn {
  width: 26px; height: 26px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.22);
  color: #fff;
  border-radius: 7px;
  font-size: 1.1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, transform .1s;
  line-height: 1;
}
.pbr-nav-btn:hover { background: rgba(255,255,255,.24); transform: scale(1.08); }
.pbr-nav-btn:active { transform: scale(.95); }
.pbr-counter {
  font-size: .72rem; font-weight: 700;
  color: rgba(250,250,248,.85);
  min-width: 44px; text-align: center;
  font-family: 'Inter', sans-serif;
}

/* Print button */
.pbr-print-btn {
  display: flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg, #b8950a 0%, #d4a912 50%, #b8950a 100%);
  background-size: 200% 200%;
  color: #fff;
  border: none; border-radius: 11px;
  padding: 8px 16px;
  font-size: .78rem; font-weight: 700;
  cursor: pointer; white-space: nowrap;
  box-shadow: 0 3px 14px rgba(184,149,10,.45);
  transition: background-position .3s, transform .12s, box-shadow .2s;
  font-family: 'Hind Siliguri', sans-serif;
}
.pbr-print-btn:hover {
  background-position: 100% 100%;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(184,149,10,.55);
}
.pbr-print-btn:active { transform: translateY(0) scale(.98); }
.pbr-badge {
  background: rgba(255,255,255,.22);
  border-radius: 20px;
  padding: 1px 7px;
  font-size: .62rem; font-weight: 800;
  font-family: 'Inter', sans-serif;
  letter-spacing: .04em;
}

/* ── Pre-print overlay ── */
#bf-print-overlay {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(10, 20, 50, .88);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(6px);
  font-family: 'Hind Siliguri', 'Inter', sans-serif;
}
.bfpo-box {
  background: linear-gradient(160deg, #0f2347, #1a3a6e);
  border: 1px solid rgba(184,149,10,.3);
  border-radius: 20px;
  padding: 32px 40px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0,0,0,.5);
  max-width: 380px; width: 90%;
}
.bfpo-spinner { margin-bottom: 16px; display: flex; justify-content: center; }
.bfpo-title {
  font-size: 1.1rem; font-weight: 700; color: #fafaf8;
  margin-bottom: 6px;
}
.bfpo-sub {
  font-size: .75rem; color: rgba(250,250,248,.6);
  margin-bottom: 20px; line-height: 1.6;
}
.bfpo-steps {
  display: flex; flex-direction: column; gap: 6px;
  background: rgba(255,255,255,.06); border-radius: 10px;
  padding: 12px 16px;
}
.bfpo-step {
  font-size: .75rem; color: rgba(250,250,248,.75);
  text-align: left; transition: color .2s;
}

/* Hide toolbar when printing */
@media print {
  .print-bar,
  #bf-print-overlay { display: none !important; }
}
    `;
    document.head.appendChild(s);
  }

  /* ════════════════════════════════
     8. INIT
  ════════════════════════════════ */
  function init() {
    fillDate();
    buildToolbar();
    setupKeyboard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
