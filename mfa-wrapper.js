// mfa-wrapper.js — robust wrapper for all MFA screens (Advanced mode)
// Keep "Include Default Head Tags" ON for each MFA screen.
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

  // Find whatever Auth0 injected (form or its top container) and move it
  function moveDefaultUI() {
    const mount = document.getElementById('auth0-mfa-mount');
    if (!mount) return false;

    // 1) Prefer top-level children that are NOT our shell
    const topLevel = Array.from(document.body.children)
      .filter(el => !el.hasAttribute('data-shell-root') && el.tagName !== 'SCRIPT' && el.tagName !== 'LINK');

    if (topLevel.length) {
      // pick the largest element by rendered area (usually the MFA root)
      let best = null, bestArea = 0;
      for (const el of topLevel) {
        const r = el.getBoundingClientRect();
        const area = Math.max(0, r.width * r.height);
        if (area > bestArea) { bestArea = area; best = el; }
      }
      if (best) {
        mount.appendChild(best);
        best.style.width = '100%';
        return true;
      }
    }

    // 2) Fallback: look for a POST form and grab a stable ancestor
    const form = document.querySelector('form[method="post"]') || document.querySelector('form');
    if (form) {
      const root =
        form.closest('body > div, main, [data-testid], [role="main"], [data-screen]') || form;
      if (!mount.contains(root)) mount.appendChild(root);
      root.style.width = '100%';
      return true;
    }

    return false;
  }

  function start() {
    buildShell();

    // Try immediately; if it isn't ready yet, watch for it
    if (moveDefaultUI()) return;

    const obs = new MutationObserver(() => { if (moveDefaultUI()) obs.disconnect(); });
    obs.observe(document.documentElement, { childList: true, subtree: true });

    // stop watching after 10s
    setTimeout(() => obs.disconnect(), 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
