// Build two-column layout and move the Auth0 login form into the right card.
// Keep "Include Default Head Tags" checked so Auth0 renders its advanced login form.

const html = String.raw;

function buildLayout() {
  const container = document.createElement('div');
  container.innerHTML = html`
    <div class="topbar">
      <div class="brand">ESQUIRE | CONNECT</div>
    </div>

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
        <div id="login-box"></div>
        <div class="note">Password is case-sensitive. Session expires after 30 minutes of inactivity.</div>

        <div class="signup">
          <div>
            <b>First time?</b><br/>
            <span style="font-size:12px;color:var(--muted)">Register to see all EsquireConnect has to offer.</span>
          </div>
          <a class="btn" href="?screen_hint=signup">Sign up</a>
        </div>
      </aside>
    </main>
  `;
  document.body.prepend(...Array.from(container.childNodes));
}

function moveAuth0Form() {
  const mount = document.getElementById('login-box');
  if (!mount) return false;
  // Look for the built-in advanced login form
  const form = document.querySelector('form[method="post"]') || document.querySelector('form');
  if (!form) return false;
  const wrapper = form.closest('[data-testid], [role="form"], form') || form;
  if (!mount.contains(wrapper)) mount.appendChild(wrapper);
  return true;
}

function start() {
  buildLayout();
  // Try immediately, then retry for late renders
  if (moveAuth0Form()) return;
  let tries = 0;
  const id = setInterval(() => {
    tries += 1;
    if (moveAuth0Form() || tries > 30) clearInterval(id);
  }, 80);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
