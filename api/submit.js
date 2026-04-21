// api/submit.js — Vercel Serverless Function
// GAS URL은 환경변수에만 존재, 브라우저에 노출되지 않음

export default async function handler(req, res) {
  // CORS 허용 (같은 Vercel 프로젝트 내)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const GAS_URL = process.env.GAS_BASE_URL;
  if (!GAS_URL) {
    return res.status(500).json({ ok: false, error: 'GAS_BASE_URL 환경변수 미설정' });
  }

  try {
    const body = req.body;

    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { ok: true }; }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
