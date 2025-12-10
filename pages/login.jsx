import { useState } from 'react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

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
      setError(data.error || 'Invalid password. Please try again.');
    } catch (err) {
      setError('Network error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 backdrop-blur">
        <div className="space-y-2">
          <div className="text-blue-400 font-semibold tracking-[0.25em] text-xs">ACCLAIM LIGHTING</div>
          <h1 className="text-2xl font-bold">White Light Linear Portal</h1>
          <p className="text-sm text-slate-400">Enter the shared password to continue.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold rounded-lg transition shadow-lg shadow-blue-900/40"
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>

        <div className="text-xs text-slate-500">
          Access restricted to authorized reps.
        </div>
      </div>
    </div>
  );
}
