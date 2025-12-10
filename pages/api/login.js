export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const password = process.env.PROTECT_PASSWORD;

  if (!password) {
    return res.status(500).json({ error: 'Protection password is not configured.' });
  }

  const provided = typeof req.body === 'string' ? req.body : req.body?.password;

  if (provided === password) {
    const secure = process.env.NODE_ENV === 'production';
    const maxAge = 60 * 60 * 12; // 12 hours

    res.setHeader('Set-Cookie', [
      `al_guard=ok; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? '; Secure' : ''}`,
    ]);
    return res.status(200).json({ ok: true });
  }

  return res.status(401).json({ error: 'Invalid password.' });
}
