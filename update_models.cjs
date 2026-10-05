const fs = require('fs');

const html = fs.readFileSync('nvidia_models_report_2026-10-05T04-16-59-416Z.html', 'utf-8');
const regex = /&quot;id&quot;:\s*&quot;([^&]+)&quot;/g;
let match;
const models = [];

while ((match = regex.exec(html)) !== null) {
  if (!models.includes(match[1])) {
    models.push(match[1]);
  }
}

let tsCode = `export type ModelCategory = 'All' | 'Engineering' | 'Reasoning' | 'Coding' | 'Multimodal' | 'Long Context' | 'Fast' | 'Agentic';
export type ModelStatus = 'available' | 'unavailable' | 'deprecated' | 'experimental';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory[];
  description?: string;
  capabilities: string[];
  contextWindow?: string;
  inputModalities: string[];
  recommendedFor: string[];
  speedClass?: 'Fast' | 'Normal' | 'Slow';
  reasoningClass?: 'Basic' | 'Advanced' | 'Expert';
  freeEndpoint: boolean;
  status: ModelStatus;
  badge?: 'Recommended' | '1M Context' | 'Fast' | 'Vision' | 'Coding' | 'Lightweight' | 'Advanced';
}

export const ATOM_AUTO_ID = 'atom-auto';

export const availableModels: AIModel[] = [
  {
    id: ATOM_AUTO_ID,
    name: "ATOM Auto",
    provider: "System",
    category: ['All'],
    description: "Choose a model automatically based on your task.",
    capabilities: ["routing"],
    inputModalities: ["Text", "Image"],
    recommendedFor: ["General use", "Automatic task routing"],
    freeEndpoint: true,
    status: 'available',
    badge: 'Recommended'
  },
`;

models.forEach(id => {
  // Try to generate a nice name
  let name = id.split('/').pop().replace(/-/g, ' ');
  name = name.replace(/\b\w/g, l => l.toUpperCase());
  let provider = id.split('/')[0];
  provider = provider.replace(/\b\w/g, l => l.toUpperCase());
  
  let badges = [];
  let cats = ['All'];
  let caps = ["text"];
  
  if (id.toLowerCase().includes('vision') || id.toLowerCase().includes('vl') || id.toLowerCase().includes('neva') || id.toLowerCase().includes('kosmos') || id.toLowerCase().includes('fuyu')) {
    cats.push('Multimodal');
    caps.push('image');
    badges.push("badge: 'Vision'");
  }
  if (id.toLowerCase().includes('coder') || id.toLowerCase().includes('code')) {
    cats.push('Coding');
    caps.push('coding');
    badges.push("badge: 'Coding'");
  }
  if (id.toLowerCase().includes('instruct')) {
    cats.push('Reasoning');
  }
  if (id.toLowerCase().includes('nemotron')) {
      cats.push('Engineering');
  }
  
  let badgeStr = badges.length > 0 ? `,\n    ${badges[0]}` : '';
  
  tsCode += `  {
    id: "${id}",
    name: "${name}",
    provider: "${provider}",
    category: ${JSON.stringify(cats)},
    capabilities: ${JSON.stringify(caps)},
    inputModalities: ["Text"],
    recommendedFor: ["General use"],
    freeEndpoint: true,
    status: 'available'${badgeStr}
  },
`;
});

tsCode += `];\n\nexport const DEFAULT_MODEL_ID = "nvidia/nemotron-3-super-120b-a12b";\n`;

fs.writeFileSync('src/data/models.ts', tsCode);
console.log('models.ts updated with ' + models.length + ' models.');
