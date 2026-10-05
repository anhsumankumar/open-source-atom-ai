export type ModelCategory = 'All' | 'Engineering' | 'Reasoning' | 'Coding' | 'Multimodal' | 'Long Context' | 'Fast' | 'Agentic';
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
  {
    id: "nvidia/nemotron-3-super-120b-a12b",
    name: "Deep Engineering (Nemotron 3 Super)",
    provider: "NVIDIA",
    category: ['All', 'Engineering', 'Long Context', 'Coding'],
    description: "Best for deep engineering and long context tasks.",
    capabilities: ["reasoning", "coding", "long context"],
    inputModalities: ["Text"],
    recommendedFor: ["large syllabus context", "engineering notes", "long conversations"],
    freeEndpoint: true,
    status: 'available',
    badge: '1M Context'
  },
  {
    id: "nvidia/nemotron-3-ultra-550b-a55b",
    name: "Advanced Reasoning (Nemotron 3 Ultra)",
    provider: "NVIDIA",
    category: ['All', 'Reasoning', 'Engineering', 'Agentic'],
    description: "Best for extremely complex reasoning and advanced tasks.",
    capabilities: ["advanced reasoning", "coding", "planning"],
    inputModalities: ["Text"],
    recommendedFor: ["extremely complex reasoning", "difficult engineering problems", "deep analysis"],
    freeEndpoint: true,
    status: 'available',
    badge: 'Advanced'
  },
  {
    id: "nvidia/nemotron-3.5-lightning-30b-a3b",
    name: "Fast Chat & Agentic (Nemotron 3.5 Lightning)",
    provider: "NVIDIA",
    category: ['All', 'Fast', 'Agentic'],
    description: "Lightning fast responses for quick queries.",
    capabilities: ["fast response", "text", "agentic tasks"],
    inputModalities: ["Text"],
    recommendedFor: ["fast chat", "quick questions", "agent workflows"],
    speedClass: 'Fast',
    freeEndpoint: true,
    status: 'available',
    badge: 'Fast'
  }
];

export const DEFAULT_MODEL_ID = "nvidia/nemotron-3-super-120b-a12b";
