import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import type { Connect } from 'vite';
import { availableModels, DEFAULT_MODEL_ID } from './src/data/models.ts';

// A simple Vite plugin to mock the Netlify function during local development
const localChatProxyPlugin = (apiKey: string) => {
  return {
    name: 'local-chat-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/chat', async (req: Connect.IncomingMessage, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }));
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const { messages, model } = JSON.parse(body);

            let resolvedModel = model || DEFAULT_MODEL_ID;

            const isValidModel = availableModels.some((m: any) => m.id === resolvedModel && m.id !== 'atom-auto');

            if (!isValidModel) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Invalid or unsupported model ID' }));
            }

            if (!apiKey) {
              res.statusCode = 500;
              return res.end(JSON.stringify({ error: 'NVIDIA API key not configured locally' }));
            }

            const payload: any = {
              model: resolvedModel,
              messages: messages,
              temperature: 0.2,
              max_tokens: 1024,
              stream: true
            };

            // Add specific kwargs for Nemotron models to enable thinking
            if (payload.model.includes('nemotron')) {
              payload.chat_template_kwargs = { "enable_thinking": true };
            }

            const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
              },
              body: JSON.stringify(payload)
            });

            if (!response.ok) {
              const errorText = await response.text();
              res.statusCode = response.status;
              return res.end(JSON.stringify({ error: 'NVIDIA API Error', details: errorText }));
            }

            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            res.statusCode = 200;
            res.flushHeaders();

            if (response.body) {
              const reader = response.body.getReader();
              const push = async () => {
                try {
                  while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    res.write(value);
                  }
                } catch (e) {
                  console.error('Stream reading error:', e);
                } finally {
                  res.end();
                }
              };
              push();
            } else {
              res.end();
            }
          } catch (error) {
            console.error('Local proxy error:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          }
        });
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      localChatProxyPlugin(env.NVIDIA_API_KEY)
    ],
  };
});
