// mfa-wrapper.js — robust wrapper for all MFA screens (Advanced mode)
// Keep "Include Default Head Tags" ON for these screens.
// Head Tags should load styles.css + this file.

(function () {
  const html = String.raw;

  function buildShell() {
    const root = document.createElement('div');
    root.setAttribute('data-shell-root', '');
    root.innerHTML = html`
      <div class="topbar"><div class="brand">ESQUIRE | CONNECT</div></div>
      <main class="wrap">
        <section class="left">
          <h1>Two-Step Verification</h1>
          <p class="lead">For your security, please complete multi-factor authentication.</p>

          <div class="bullets">
            <div><b>Protect your account.</b> A second step keeps your data safer.</div>
            <div><b>Use your chosen factor.</b> SMS, authenticator app, email, push, or security key.</div>
            <div><b>Need help?</b> Contact support to recover access.</div>
          </div>

          <div class="remit">
            <b>Invoice Remittance Information</b><br/>
            Esquire Deposition Solutions, LLC<br/>
            P.O. Box 846099<br/>
            Dallas, TX 75284-6099
          </div>
        </section>

        <aside class="panel">
          <h2>Verify</h2>
          <div id="auth0-mfa-mount"></div>
          <div class="note" style="margin-top:12px">
            If you can’t access this factor, use a backup method or a recovery code.
          </div>
        </aside>
      </main>
    `;
    document.body.prepend(root);
  }

  function pickLargest(elements) {
    let best = null, area = 0;
    elements.forEach(el => {
      const r = el.getBoundingClientRect();
      const a = Math.max(0, r.width * r.height);
      if (a > area) { area = a; best = el; }
    });
    return best;
  }

  function moveDefaultUI() {
    const mount = document.getElementById('auth0-mfa-mount');
    if (!mount) return false;

    // 1) Any top-level element (div/iframe) that isn't our shell/assets
    const topLevel = Array.from(document.body.children).filter(el =>
      !el.hasAttribute('data-shell-root') &&
      el.tagName !== 'SCRIPT' &&
      el.tagName !== 'LINK' &&
      el.tagName !== 'STYLE'
    );

    if (topLevel.length) {
      const best = pickLargest(topLevel);
      if (best && !mount.contains(best)) {
        mount.appendChild(best);
        best.style.width = '100%';
        return true;
      }
    }

    // 2) Fallback: form-based UI
    const form = document.querySelector('form[method="post"]') || document.querySelector('form');
    if (form) {
      const root =
        form.closest('body > div, main, [data-testid], [role="main"], [data-screen]') || form;
      if (!mount.contains(root)) mount.appendChild(root);
      root.style.width = '100%';
      return true;
    }

    // 3) Log to help diagnose
    console.log('[MFA wrapper] No default MFA UI found yet. Screen info:', 
      window.universal_login_context && window.universal_login_context.screen);

    return false;
  }

  function start() {
    // Helpful: see exactly which screen we're on
    console.log('[MFA wrapper] Context:', window.universal_login_context);

    buildShell();

    if (moveDefaultUI()) return;

    const obs = new MutationObserver(() => { if (moveDefaultUI()) obs.disconnect(); });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    setTimeout(() => obs.disconnect(), 10000);
  }

  (document.readyState === 'loading')
    ? document.addEventListener('DOMContentLoaded', start)
    : start();
})();
