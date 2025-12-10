export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const secure = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', [
    `al_guard=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`,
  ]);

  return res.status(200).json({ ok: true });
}
