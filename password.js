const html = String.raw;

function shell() {
  const node = document.createElement('div');
  node.innerHTML = html`
    <div class="topbar"><div class="brand">ESQUIRE | CONNECT</div></div>
    <main class="wrap">
      <section class="left">
        <h1>Welcome back</h1>
        <p class="lead">Enter your password to continue.</p>
      </section>

      <aside class="panel">
        <h2>Password</h2>
        <form method="post" accept-charset="utf-8">
          <div style="margin: 8px 0 16px;">
            <label for="password" style="display:block;margin-bottom:6px;font-weight:600">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required
                   style="width:100%;padding:10px 12px;border:1px solid #d5dee8;border-radius:6px">
          </div>
          <button type="submit"
                  style="padding:10px 14px;border-radius:6px;border:1px solid #0a69b5;background:#0a69b5;color:#fff;font-weight:600;cursor:pointer">
            Continue
          </button>
        </form>
        <div class="note" style="margin-top:14px">Forgot password? Use the link sent to your email from your app.</div>
      </aside>
    </main>
  `;
  document.body.prepend(...Array.from(node.childNodes));
}

(document.readyState === 'loading')
  ? document.addEventListener('DOMContentLoaded', shell)
  : shell();
