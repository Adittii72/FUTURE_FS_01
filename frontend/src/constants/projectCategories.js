import { Brain, BarChart3, Code2 } from 'lucide-react';

export const PROJECT_CATEGORY_NAMES = [
  'AI Engineer',
  'Data Science Enthusiast',
  'Full-Stack Developer',
];

export const DEFAULT_PROJECT_CATEGORY = 'Full-Stack Developer';

export const PROJECT_CATEGORIES = [
  {
    name: 'AI Engineer',
    icon: Brain,
    description: 'Building intelligent systems with cutting-edge AI technologies',
    gradient: 'from-[#00d4ff] to-[#0099ff]',
  },
  {
    name: 'Data Science Enthusiast',
    icon: BarChart3,
    description: 'Extracting insights and patterns from complex datasets',
    gradient: 'from-[#7c3aed] to-[#a855f7]',
  },
  {
    name: 'Full-Stack Developer',
    icon: Code2,
    description: 'Creating end-to-end web applications with modern technologies',
    gradient: 'from-[#00d4ff] to-[#7c3aed]',
  },
];

export function normalizeProjectCategory(category) {
  if (PROJECT_CATEGORY_NAMES.includes(category)) {
    return category;
  }
  return DEFAULT_PROJECT_CATEGORY;
}
