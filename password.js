// login-identifier-password.js — ACUL "Login" screen (Identifier + Password profile)
// Screen: Branding → Universal Login → login / login
// Rendering mode: Advanced; Include Default Head Tags: OFF
// Head Tags must load styles.css + this script

import Login from "https://esm.sh/@auth0/auth0-acul-js/login";

const html = String.raw;

function render() {
  const node = document.createElement('div');
  node.innerHTML = html`
    <div class="topbar"><div class="brand">ESQUIRE | CONNECT</div></div>

    <main class="wrap">
      <section class="left">
        <h1>EsquireConnect: <span class="sub">Your New Scheduling Assistant!</span></h1>
        <p class="lead">Watch this short video to learn more about EsquireConnect.</p>

        <div class="bullets">
          <div><b>Find your transcripts, exhibits and video files faster and easier.</b> Find, select and download your case files (including videos) in moments.</div>
          <div><b>Save time with drag-and-drop scheduling.</b> Drop your Deposition Notice and we’ll parse it to autofill your form.</div>
          <div><b>Get your Zoom meeting link in an hour or less.</b> Your link will be available in your account—no delays.</div>
        </div>

        <div class="remit">
          <b>Invoice Remittance Information</b><br/>
          Esquire Deposition Solutions, LLC<br/>
          P.O. Box 846099<br/>
          Dallas, TX 75284-6099
        </div>
      </section>

      <aside class="panel">
        <h2>User Login</h2>

        <form id="login-form" novalidate autocomplete="on">
          <div style="margin:8px 0 14px;">
            <label for="identifier" style="display:block;margin-bottom:6px;font-weight:600">Email or Username</label>
            <input id="identifier" type="text" required autocomplete="username"
                   style="width:100%;padding:10px 12px;border:1px solid #d5dee8;border-radius:6px">
          </div>

          <div style="margin:8px 0 16px;">
            <label for="password" style="display:block;margin-bottom:6px;font-weight:600">Password</label>
            <div style="position:relative">
              <input id="password" type="password" required autocomplete="current-password"
                     style="width:100%;padding:10px 40px 10px 12px;border:1px solid #d5dee8;border-radius:6px">
              <button type="button" id="togglePw"
                      aria-label="Show password"
                      style="position:absolute;right:8px;top:50%;transform:translateY(-50%);border:1px solid #d5dee8;background:#f9fbfe;border-radius:6px;padding:4px 8px;cursor:pointer">
                Show
              </button>
            </div>
          </div>

          <label style="display:flex;gap:8px;align-items:center;margin:0 0 16px;">
            <input type="checkbox" id="remember"> Remember this device
          </label>

          <button id="submitBtn" type="submit"
                  style="padding:10px 14px;border-radius:6px;border:1px solid #0a69b5;background:#0a69b5;color:#fff;font-weight:600;cursor:pointer">
            Log in
          </button>

          <div style="margin-top:10px">
            <a href="?screen_hint=reset-password">Forgot password?</a>
          </div>
        </form>

        <div id="error" class="note" style="display:none;margin-top:12px;color:#b42318"></div>

        <div class="note" style="margin-top:14px">
          Password is case-sensitive. Session expires after 30 minutes of inactivity.
        </div>

        <div class="signup">
          <div><b>First time?</b><br/><span style="font-size:12px;color:var(--muted)">Register to see all EsquireConnect has to offer.</span></div>
          <a class="btn" href="?screen_hint=signup">Sign up</a>
        </div>
      </aside>
    </main>
  `;
  document.body.prepend(...Array.from(node.childNodes));
}

function renderError(screen, el) {
  const errs = (screen?.getError && screen.getError()) || [];
  if (!errs.length) { el.style.display = 'none'; el.textContent = ''; return; }
  const first = errs[0];
  el.textContent = first?.description || first?.message || 'Unable to sign in. Please try again.';
  el.style.display = 'block';
}

async function start() {
  render();

  const login = new Login(); // ACUL Login screen class (Identifier + Password)
  const form = document.getElementById('login-form');
  const idEl = document.getElementById('identifier');
  const pwEl = document.getElementById('password');
  const rememberEl = document.getElementById('remember');
  const toggle = document.getElementById('togglePw');
  const submitBtn = document.getElementById('submitBtn');
  const errorEl = document.getElementById('error');

  // Focus identifier initially; if filled (e.g. browser autofill), focus password
  (idEl?.value ? pwEl : idEl)?.focus();

  // Show/hide password
  toggle.addEventListener('click', () => {
    const showing = pwEl.type === 'text';
    pwEl.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Show' : 'Hide';
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    pwEl.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.style.display = 'none';

    const identifier = (idEl.value || '').trim();
    const password = (pwEl.value || '').trim();
    if (!identifier) { idEl.focus(); return; }
    if (!password) { pwEl.focus(); return; }

    submitBtn.disabled = true;

    try {
      // Different SDK revisions expose .login({ ... }) or .continue({ ... })
      const payload = {
        // Provide multiple keys; SDK will use the right one (username/email/loginId/identifier)
        username: identifier, email: identifier, loginId: identifier, identifier,
        password,
        rememberDevice: !!rememberEl.checked
      };

      if (typeof login.login === 'function') {
        await login.login(payload);
      } else if (typeof login.continue === 'function') {
        await login.continue(payload);
      } else if (typeof login.authenticate === 'function') {
        await login.authenticate(payload);
      } else {
        throw new Error('Unsupported SDK method on Login screen class');
      }
      // On success, Auth0 advances or redirects automatically.
    } catch (err) {
      console.warn('Login error', err);
      renderError(login, errorEl);
      submitBtn.disabled = false;
      pwEl.focus();
    }
  });

  // If we arrived with a transaction error, show it
  renderError(login, errorEl);
}

(document.readyState === 'loading')
  ? document.addEventListener('DOMContentLoaded', start)
  : start();
