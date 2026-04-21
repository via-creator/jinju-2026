// api/feed.js — Vercel Serverless Function
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const GAS_URL   = process.env.GAS_BASE_URL;
  const ADMIN_KEY = process.env.ADMIN_KEY;

  if (!GAS_URL) return res.status(500).json({ ok: false, error: 'GAS_BASE_URL 미설정' });

  const { key, building } = req.query;

  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ ok: false, error: '인증 실패' });
  }

  try {
    const b = building || '전체';
    const url = `${GAS_URL}?key=${ADMIN_KEY}&building=${encodeURIComponent(b)}`;
    const response = await fetch(url);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
