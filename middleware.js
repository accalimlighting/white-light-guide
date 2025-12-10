// Edge middleware to enforce a single shared password (no username needed).
// Set PROTECT_PASSWORD in your Vercel project settings.
import { NextResponse } from 'next/server';

export const config = {
  matcher: '/:path*',
};

export function middleware(request) {
  const password = process.env.PROTECT_PASSWORD;

  if (!password) {
    return new NextResponse('Protection password is not configured.', { status: 500 });
  }

  const pathname = request.nextUrl.pathname;
  const allowedPaths = ['/api/login', '/api/logout', '/favicon.ico', '/robots.txt', '/manifest.json'];
  const hasAuthCookie = request.cookies.get('al_guard')?.value === 'ok';

  if (hasAuthCookie || allowedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const loginPage = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex, nofollow" />
        <title>Secure Access | Acclaim Lighting</title>
        <style>
          :root {
            color-scheme: dark;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at 20% 20%, rgba(47, 140, 159, 0.25), transparent 45%),
                        radial-gradient(circle at 80% 10%, rgba(230, 70, 61, 0.28), transparent 40%),
                        #0b1220;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            color: #e5eaf1;
            padding: 24px;
          }
          .card {
            width: min(420px, 100%);
            background: rgba(14, 24, 40, 0.9);
            border: 1px solid rgba(67, 84, 104, 0.5);
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.35);
            backdrop-filter: blur(8px);
          }
          .eyebrow {
            letter-spacing: 0.25em;
            color: #5cb3ff;
            font-size: 11px;
            font-weight: 600;
          }
          h1 {
            margin: 6px 0 4px;
            font-size: 24px;
            color: #f5f7fb;
          }
          p {
            margin: 0;
            color: #8ea4c1;
            font-size: 14px;
          }
          label {
            display: block;
            margin-bottom: 6px;
            font-size: 13px;
            color: #c9d4e5;
          }
          input {
            width: 100%;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #2f3d55;
            background: #111a2a;
            color: #e5eaf1;
            font-size: 14px;
            outline: none;
          }
          input:focus {
            border-color: #3388ff;
            box-shadow: 0 0 0 2px rgba(51,136,255,0.25);
          }
          button {
            width: 100%;
            padding: 12px 14px;
            border: none;
            border-radius: 10px;
            background: linear-gradient(135deg, #3388ff, #1f6fd6);
            color: #fff;
            font-weight: 700;
            font-size: 14px;
            cursor: pointer;
            margin-top: 8px;
          }
          button:hover { filter: brightness(1.05); }
          .error {
            margin-top: 10px;
            color: #ffb4b4;
            background: rgba(255, 99, 99, 0.12);
            border: 1px solid rgba(255, 99, 99, 0.3);
            border-radius: 10px;
            padding: 10px 12px;
            font-size: 13px;
          }
          .hint {
            margin-top: 12px;
            color: #6f85a5;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="eyebrow">ACCLAIM LIGHTING</div>
          <h1>White Light Linear Portal</h1>
          <p>Enter the shared password to continue.</p>
          <form id="auth-form">
            <div style="margin-top:16px;">
              <label for="password">Password</label>
              <input id="password" name="password" type="password" autocomplete="current-password" required />
            </div>
            <button type="submit">Enter</button>
            <div id="error" class="error" style="display:none;"></div>
          </form>
          <div class="hint">Access restricted to authorized reps.</div>
        </div>
        <script>
          const form = document.getElementById('auth-form');
          const errorEl = document.getElementById('error');
          form.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorEl.style.display = 'none';
            const password = document.getElementById('password').value;
            try {
              const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
              });
              if (res.ok) {
                window.location.href = '/';
                return;
              }
              const data = await res.json().catch(() => ({}));
              errorEl.textContent = data.error || 'Invalid password. Please try again.';
              errorEl.style.display = 'block';
            } catch (err) {
              errorEl.textContent = 'Network error. Please retry.';
              errorEl.style.display = 'block';
            }
          });
        </script>
      </body>
    </html>
  `;

  return new NextResponse(loginPage, {
    status: 401,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
