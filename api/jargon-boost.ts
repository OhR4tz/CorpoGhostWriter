import { handleJargonBoost } from '../src/server/letterLogic';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { text = '', level = 'heavy' } = body;
    const result = await handleJargonBoost(text, level);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error('Error in /api/jargon-boost serverless function:', err);
    return res.status(500).json({ error: err?.message || 'Internal server error' });
  }
}
