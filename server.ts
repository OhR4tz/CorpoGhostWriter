import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  handleGenerateLetter,
  handleChatAssistant,
  handleJargonBoost,
} from './src/server/letterLogic';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Generate Letter Endpoint
  app.post('/api/generate-letter', async (req, res) => {
    try {
      const result = await handleGenerateLetter(req.body);
      return res.json(result);
    } catch (err: any) {
      console.error('Error generating letter:', err);
      return res.status(500).json({
        error: 'Failed to generate corporate letter',
        details: err?.message || String(err),
      });
    }
  });

  // Chat Ghostwriter Assistant Loop Endpoint
  app.post('/api/chat-assistant', async (req, res) => {
    try {
      const { messages = [], currentDraft = '', userContext = {} } = req.body;
      const result = await handleChatAssistant(messages, currentDraft, userContext);
      return res.json(result);
    } catch (err: any) {
      console.error('Error in chat assistant:', err);
      return res.status(500).json({ error: 'Chat assistant error', details: err?.message });
    }
  });

  // Jargon Transform Endpoint
  app.post('/api/jargon-boost', async (req, res) => {
    try {
      const { text = '', level = 'heavy' } = req.body;
      const result = await handleJargonBoost(text, level);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ error: 'Jargon transform failed' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Corporate Letter Assistant server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
