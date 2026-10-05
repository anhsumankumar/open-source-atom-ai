const fs = require('fs');
let envContent = fs.readFileSync('.env.local', 'utf-8');
let apiKeyMatch = envContent.match(/NVIDIA_API_KEY=\"?([^\"]+)\"?/);
let apiKey = apiKeyMatch ? apiKeyMatch[1].trim().replace(/\"/g, '') : '';

async function run() {
  const res = await fetch('https://integrate.api.nvidia.com/v1/models', {
    headers: { 'Authorization': 'Bearer ' + apiKey }
  });
  const data = await res.json();
  const allModels = data.data.map(m => m.id);
  
  // Pick some diverse models to test 
  const models = [
    'deepseek-ai/deepseek-coder-6.7b-instruct',
    'google/gemma-3-12b-it',
    'meta/llama-3.2-90b-vision-instruct',
    'meta/llama3-70b-instruct',
    'mistralai/mistral-large',
    'nvidia/nemotron-3-super-120b-a12b',
    'nvidia/nemotron-4-340b-instruct',
    'z-ai/glm-5.3'
  ];
  
  for (const m of models) {
    if (!allModels.includes(m) && m !== 'meta/llama3-70b-instruct') {
      console.log(m, 'not in /v1/models');
      continue;
    }
    
    try {
      const chatRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
        body: JSON.stringify({
          model: m,
          messages: [{role: 'user', content: 'Say hello'}],
          stream: false,
          max_tokens: 5
        })
      });
      const text = await chatRes.text();
      console.log(m, chatRes.status, chatRes.status !== 200 ? text : 'OK');
    } catch(e) {
      console.log(m, e.message);
    }
  }
}
run();
