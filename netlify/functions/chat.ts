import type { Config, Context } from "@netlify/functions";
import { availableModels, DEFAULT_MODEL_ID } from "../../src/data/models";

export default async (req: Request, context: Context) => {
  // CORS Headers for local testing if needed
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json', ...headers } 
    });
  }

  try {
    const { messages, model } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json', ...headers }
      });
    }

    let resolvedModel = model || DEFAULT_MODEL_ID;
    
    const isValidModel = availableModels.some(m => m.id === resolvedModel && m.id !== 'atom-auto');

    if (!isValidModel) {
      return new Response(JSON.stringify({ error: 'Invalid or unsupported model ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...headers }
      });
    }

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error('NVIDIA_API_KEY is not set');
      return new Response(JSON.stringify({ error: 'NVIDIA API key not configured' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...headers }
      });
    }

    const payload: any = {
      model: resolvedModel,
      messages: messages,
      temperature: 0.2,
      max_tokens: 1024,
      stream: true,
    };

    if (resolvedModel.includes('nemotron')) {
      payload.chat_template_kwargs = { "enable_thinking": true };
    }

    // Call the NVIDIA API
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
      console.error('NVIDIA API Error:', response.status, errorText);
      return new Response(JSON.stringify({ error: 'NVIDIA API Error', details: errorText }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json', ...headers }
      });
    }

    // Return the stream directly
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...headers
      }
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json', ...headers }
    });
  }
};

export const config: Config = {
  path: "/api/chat"
};
