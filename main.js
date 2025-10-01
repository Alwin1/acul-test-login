// main.js — Minimal ACUL Login-ID screen (no default head tags)
const html = String.raw;

function shell() {
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

        <!-- Minimal ACUL-compatible form: urlencoded POST to same URL -->
        <form id="login-id-form" method="post" accept-charset="utf-8">
          <div style="margin: 8px 0 16px;">
            <label for="identifier" style="display:block;margin-bottom:6px;font-weight:600">Email or Username</label>
            <!-- If your tenant expects 'identifier', change name="username" -> name="identifier" -->
            <input id="identifier" name="username" type="text" autocomplete="username" required
                   style="width:100%;padding:10px 12px;border:1px solid #d5dee8;border-radius:6px">
          </div>

          <button type="submit"
                  style="padding:10px 14px;border-radius:6px;border:1px solid #0a69b5;background:#0a69b5;color:#fff;font-weight:600;cursor:pointer">
            Continue
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

function wireSubmit() {
  const form = document.getElementById('login-id-form');
  const errorEl = document.getElementById('error');

  form.addEventListener('submit', (e) => {
    // Ensure urlencoded submission to same URL (no fetch/JSON)
    // ACUL requires standard form POST; leave default behavior in place.
    errorEl.style.display = 'none';
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { shell(); wireSubmit(); });
} else {
  shell(); wireSubmit();
}
