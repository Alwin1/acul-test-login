// login-with-password.js — Advanced mode for "login / login" (single screen)
// Requirements:
// - Identifier-First OFF (Authentication → Authentication Profile)
// - Screen: Universal Login → Customize authentication screens → login / login
// - Rendering mode: Advanced
// - Include Default Head Tags: OFF
// - Head Tags: link to styles.css and this script

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

        <!-- ACUL requires a regular URL-encoded POST to the SAME URL -->
        <form id="login-form" method="post" accept-charset="utf-8" autocomplete="on">
          <div style="margin: 8px 0 14px;">
            <label for="username" style="display:block;margin-bottom:6px;font-weight:600">Email or Username</label>
            <!-- If your tenant expects 'identifier', change name="username" to name="identifier" -->
            <input id="username" name="username" type="text" required autocomplete="username"
                   style="width:100%;padding:10px 12px;border:1px solid #d5dee8;border-radius:6px">
          </div>

          <div style="margin: 8px 0 16px;">
            <label for="password" style="display:block;margin-bottom:6px;font-weight:600">Password</label>
            <div style="position:relative">
              <input id="password" name="password" type="password" required autocomplete="current-password"
                     style="width:100%;padding:10px 40px 10px 12px;border:1px solid #d5dee8;border-radius:6px">
              <button type="button" id="togglePw"
                      aria-label="Show password"
                      style="position:absolute;right:8px;top:50%;transform:translateY(-50%);border:1px solid #d5dee8;background:#f9fbfe;border-radius:6px;padding:4px 8px;cursor:pointer">
                Show
              </button>
            </div>
          </div>

          <button type="submit"
                  style="padding:10px 14px;border-radius:6px;border:1px solid #0a69b5;background:#0a69b5;color:#fff;font-weight:600;cursor:pointer">
            Log in
          </button>
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

function wireUp() {
  const u = document.getElementById('username');
  const p = document.getElementById('password');
  const toggle = document.getElementById('togglePw');
  const form = document.getElementById('login-form');
  const err = document.getElementById('error');

  // Autofocus username, then password if username already present (back nav)
  (u?.value ? p : u)?.focus();

  // Show/hide password
  toggle?.addEventListener('click', () => {
    const showing = p.type === 'text';
    p.type = showing ? 'password' : 'text';
    toggle.textContent = showing ? 'Show' : 'Hide';
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    p.focus();
  });

  // Let browser submit as application/x-www-form-urlencoded to the same URL
  form?.addEventListener('submit', () => {
    err.style.display = 'none';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { render(); wireUp(); });
} else {
  render(); wireUp();
}
