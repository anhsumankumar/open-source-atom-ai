import { 
  Home, 
  BookOpen, 
  FileText, 
  Files, 
  Sigma, 
  Triangle, 
  Wrench 
} from 'lucide-react';

export const navigationLinks = [
  { name: 'Home', icon: Home, isActive: true },
  { name: 'Subjects', icon: BookOpen },
  { name: 'Notes', icon: FileText },
  { name: 'PYQs', icon: Files },
  { name: 'Formulas', icon: Sigma },
  { name: 'Diagrams', icon: Triangle },
  { name: 'Tools', icon: Wrench },
];

export const recentChats = [
  'Explain KCL and KVL',
  'Stress-Strain Curve',
  'OS vs DBMS Comparison',
  'Laplace Transform',
  'Design a PID Controller',
  'How does a transistor work?',
  'Reinforced Concrete Design',
  'Difference between BFS and DFS',
  'Thermodynamics Basics',
  'Show me DAA important topics'
];

export const userProfile = {
  name: 'Anshuman',
  plan: 'Free Plan',
  avatar: 'A'
};
