// main.js — wrap, don't move
const html = String.raw;

function buildScaffold() {
  // Top bar + 2-col scaffold
  const scaffold = document.createElement('div');
  scaffold.innerHTML = html`
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
        <div id="auth0-mount"></div>
        <div class="note">Password is case-sensitive. Session expires after 30 minutes of inactivity.</div>
        <div class="signup">
          <div><b>First time?</b><br/><span style="font-size:12px;color:var(--muted)">Register to see all EsquireConnect has to offer.</span></div>
          <a class="btn" href="?screen_hint=signup">Sign up</a>
        </div>
      </aside>
    </main>
  `;
  document.body.prepend(...Array.from(scaffold.childNodes));
}

function wrapAuth0() {
  const mount = document.getElementById('auth0-mount');
  if (!mount) return false;

  // Find the main Auth0 container (don’t pick our own scaffold)
  const form = document.querySelector('form[method="post"]') || document.querySelector('form');
  if (!form) return false;

  // Take the highest useful ancestor (so React/SDK keeps control)
  const root = form.closest('main, [data-testid], [role="main"], [data-screen], #app, body > div') || form;

  // Skip if we already wrapped
  if (mount.contains(root)) return true;

  // Move the root container into our right column (one-time)
  mount.appendChild(root);
  return true;
}

function start() {
  buildScaffold();

  // Try immediately + observe future renders
  if (wrapAuth0()) return;

  const obs = new MutationObserver(() => {
    if (wrapAuth0()) obs.disconnect();
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });

  // Safety timeout after 10s
  setTimeout(() => obs.disconnect(), 10000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
