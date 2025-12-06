export interface ProjectIdea {
  idea: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  features?: string[];
  constraints?: string[];
}

export interface FeasibilityResult {
  isFeasible: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  concerns: string[];
  recommendations: string[];
  estimatedHours: number;
}

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  deployment?: string[];
  aiTools?: string[];
  reasoning: string;
}

export interface Timeline {
  phases: TimelinePhase[];
  totalHours: number;
}

export interface TimelinePhase {
  name: string;
  description: string;
  hours: number;
  tasks: string[];
}

export interface ClineTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  dependencies?: string[];
}

export interface Pitch {
  title: string;
  tagline: string;
  problem: string;
  solution: string;
  techHighlights: string[];
  demoUrl?: string;
}

export interface CoachOutput {
  feasibility: FeasibilityResult;
  techStack: TechStack;
  timeline: Timeline;
  clineTasks: ClineTask[];
  pitch: Pitch;
  scaffoldFiles?: Record<string, string>;
}
