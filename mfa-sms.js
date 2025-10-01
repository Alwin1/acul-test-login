// mfa-sms.js — self-rendered MFA SMS *with* SDK send + verify
// Screen: Branding → Universal Login → mfa-sms / mfa-sms-challenge
// Advanced mode ON, Include Default Head Tags OFF
// Head Tags: styles.css + this file

import MfaSmsChallenge from "https://esm.sh/@auth0/auth0-acul-js/mfa-sms-challenge";
import MfaPhoneChallenge from "https://esm.sh/@auth0/auth0-acul-js/mfa-phone-challenge";

const html = String.raw;

function render() {
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
          Esquire Deposition Solutions, LLC<br/>P.O. Box 846099<br/>Dallas, TX 75284-6099
        </div>
      </section>

      <aside class="panel">
        <h2>Verify</h2>

        <form id="mfa-form" autocomplete="one-time-code">
          <div style="margin:8px 0 8px;">
            <label for="code" style="display:block;margin-bottom:6px;font-weight:600">Verification code</label>
            <input id="code" inputmode="numeric" pattern="[0-9]*" maxlength="8"
                   placeholder="Enter 6-digit code"
                   style="width:100%;padding:10px 12px;border:1px solid #d5dee8;border-radius:6px" required>
          </div>

          <label style="display:flex;gap:8px;align-items:center;margin:8px 0 16px;">
            <input type="checkbox" id="remember"> Remember this device
          </label>

          <div style="display:flex;gap:12px;align-items:center">
            <button type="submit"
                    style="padding:10px 14px;border-radius:6px;border:1px solid #0a69b5;background:#0a69b5;color:#fff;font-weight:600;cursor:pointer">
              Verify
            </button>
            <a href="#" id="resend" style="font-weight:600">Resend code</a>
          </div>
        </form>

        <div id="error" class="note" style="display:none;margin-top:12px;color:#b42318"></div>
      </aside>
    </main>
  `;
  document.body.prepend(...Array.from(node.childNodes));
}

async function start() {
  render();

  const form = document.getElementById('mfa-form');
  const input = document.getElementById('code');
  const remember = document.getElementById('remember');
  const resend = document.getElementById('resend');
  const errorEl = document.getElementById('error');

  const screenName = window.universal_login_context?.screen?.name || "";
  // If we land on the selector screen (phone), request an SMS challenge now.
  if (screenName === "mfa-phone-challenge") {
    try {
      const phone = new MfaPhoneChallenge();
      // Ask server to send an SMS now (instead of voice). Some SDK builds use { method: "sms" } or { type: "sms" }.
      await phone.continue({ method: "sms" });
    } catch (e) {
      // non-fatal; user can still request resend
      console.warn("Initial SMS request failed:", e);
    }
  }

  // If we’re already on mfa-sms-challenge, proactively (re)send the code on load.
  if (screenName === "mfa-sms-challenge") {
    try {
      const sms = new MfaSmsChallenge();
      await sms.resendCode(); // make sure a fresh code is sent when page loads
    } catch (e) {
      console.warn("Auto-resend failed:", e);
    }
  }

  // Resend link
  resend.addEventListener('click', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';
    try {
      const sms = new MfaSmsChallenge();
      await sms.resendCode();
      resend.textContent = "Code sent";
      setTimeout(() => (resend.textContent = "Resend code"), 3000);
    } catch (err) {
      errorEl.textContent = "We couldn’t resend the code. Please try again.";
      errorEl.style.display = 'block';
    }
  });

  // Submit/verify
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';
    const code = (input.value || "").replace(/\D+/g, "").slice(0, 8);

    try {
      const sms = new MfaSmsChallenge();
      await sms.continueMfaSmsChallenge({ code, rememberDevice: !!remember.checked });
      // If successful, Auth0 will continue the transaction automatically.
    } catch (err) {
      errorEl.textContent = "Invalid or expired code. Please try again.";
      errorEl.style.display = 'block';
      input.focus();
    }
  });

  input.focus();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
