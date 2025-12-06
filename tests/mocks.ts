import { ProjectIdea } from '../src/types';

/**
 * Mock AI Client for testing
 * Returns predefined responses without making actual API calls
 */
export class MockAIClient {
  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    return 'Mock AI response';
  }

  async generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T> {
    // Detect which type of request based on prompt content
    if (prompt.includes('Analyze this hackathon project idea')) {
      // FeasibilityResult mock
      return {
        isFeasible: true,
        riskLevel: 'medium',
        concerns: ['Time constraints for API integration', 'Learning curve for new technologies'],
        recommendations: ['Start with MVP features', 'Use familiar tech stack', 'Plan buffer time'],
        estimatedHours: 18
      } as any;
    } else if (prompt.includes('Recommend an ultra-lean tech stack')) {
      // TechStack mock
      return {
        frontend: ['React', 'Vite', 'TailwindCSS'],
        backend: ['Node.js', 'Express', 'TypeScript'],
        database: ['PostgreSQL', 'Prisma'],
        deployment: ['DigitalOcean App Platform', 'Vercel'],
        aiTools: ['Anthropic Claude API', 'OpenAI API'],
        reasoning: 'This stack is chosen for rapid development with minimal setup time.'
      } as any;
    } else if (prompt.includes('Create a detailed timeline')) {
      // Timeline mock
      return {
        totalHours: 18,
        phases: [
          {
            name: 'Setup & Planning',
            hours: 2,
            description: 'Environment setup and project scaffolding',
            tasks: ['Initialize repo', 'Set up dev environment', 'Install dependencies']
          },
          {
            name: 'Core Development',
            hours: 10,
            description: 'Build main features',
            tasks: ['Implement backend API', 'Create frontend components', 'Integrate AI']
          },
          {
            name: 'Testing & Polish',
            hours: 4,
            description: 'Bug fixes and improvements',
            tasks: ['Test features', 'Fix bugs', 'Polish UI']
          },
          {
            name: 'Deployment & Demo',
            hours: 2,
            description: 'Deploy and prepare presentation',
            tasks: ['Deploy to platform', 'Prepare demo', 'Create pitch']
          }
        ]
      } as any;
    } else if (prompt.includes('Break down this project into specific')) {
      // ClineTask[] mock
      return [
        {
          id: 'task-1',
          title: 'Initialize project structure',
          description: 'Set up the basic project structure with necessary files',
          priority: 'high',
          estimatedMinutes: 30,
          dependencies: []
        },
        {
          id: 'task-2',
          title: 'Implement API endpoints',
          description: 'Create REST API endpoints for core functionality',
          priority: 'high',
          estimatedMinutes: 120,
          dependencies: ['task-1']
        },
        {
          id: 'task-3',
          title: 'Build frontend UI',
          description: 'Create user interface components',
          priority: 'medium',
          estimatedMinutes: 180,
          dependencies: ['task-1']
        }
      ] as any;
    } else if (prompt.includes('Create a compelling pitch')) {
      // Pitch mock
      return {
        title: 'AI Project Assistant',
        tagline: 'Your intelligent companion for rapid project development',
        problem: 'Developers struggle to scope and plan hackathon projects effectively',
        solution: 'An AI-powered tool that validates ideas and generates actionable plans',
        techHighlights: [
          'Powered by Claude AI for intelligent recommendations',
          'Automated task generation for AI coding assistants',
          'Smart tech stack recommendations based on experience'
        ]
      } as any;
    } else if (prompt.includes('Generate a complete project scaffold')) {
      // ScaffoldFiles mock
      return {
        'README.md': '# Mock Project\n\nGenerated project scaffold',
        'package.json': '{"name": "mock-project", "version": "1.0.0"}',
        'src/index.ts': '// Mock entry point\nconsole.log("Hello World");'
      } as any;
    }

    return {} as T;
  }
}

export const mockProjectIdea: ProjectIdea = {
  idea: 'A web app that uses AI to generate personalized study plans',
  experienceLevel: 'intermediate',
  features: ['AI generation', 'Progress tracking', 'Study recommendations']
};

export const mockProjectIdeaSimple: ProjectIdea = {
  idea: 'A simple todo list app',
  experienceLevel: 'beginner'
};

export const mockProjectIdeaComplex: ProjectIdea = {
  idea: 'A real-time multiplayer game with blockchain integration and AI opponents',
  experienceLevel: 'advanced',
  features: ['Real-time multiplayer', 'Blockchain', 'AI opponents', 'Voice chat']
};
