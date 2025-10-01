// mfa-wrapper.js — wrap any MFA screen in your 2-column shell (Advanced mode)
// Keep "Include Default Head Tags" ON so Auth0 injects the factor UI.
// Head Tags for each MFA screen should load styles.css and this file.

const html = String.raw;

function buildShell() {
  const node = document.createElement('div');
  node.innerHTML = html`
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
          If you can’t access this factor, use a backup method or recovery code.
        </div>
      </aside>
    </main>
  `;
  document.body.prepend(...Array.from(node.childNodes));
}

function wrapMfa() {
  const mount = document.getElementById('auth0-mfa-mount');
  if (!mount) return false;

  // Find Auth0's injected MFA UI (a form or the screen's main container)
  const form = document.querySelector('form[method="post"]') || document.querySelector('form');
  const candidate =
    form?.closest('main, [data-testid], [role="main"], [data-screen], body > div') ||
    document.querySelector('[data-testid], [data-screen], body > div main') ||
    form;

  if (!candidate) return false;
  if (!mount.contains(candidate)) mount.appendChild(candidate);
  return true;
}

function start() {
  buildShell();

  // Try immediately; if not ready, observe until the default UI appears
  if (wrapMfa()) return;

  const obs = new MutationObserver(() => {
    if (wrapMfa()) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });

  setTimeout(() => obs.disconnect(), 10000); // safety stop
}

(document.readyState === 'loading')
  ? document.addEventListener('DOMContentLoaded', start)
  : start();
