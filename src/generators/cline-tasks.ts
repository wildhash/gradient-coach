import { ProjectIdea, ClineTask, Timeline, TechStack } from '../types';
import { GradientAIClient } from '../utils/ai-client';

export class ClineTaskGenerator {
  private ai: GradientAIClient;

  constructor(ai: GradientAIClient) {
    this.ai = ai;
  }

  async generate(
    project: ProjectIdea,
    techStack: TechStack,
    timeline: Timeline
  ): Promise<ClineTask[]> {
    const systemPrompt = `You are an expert at breaking down projects into actionable Cline AI assistant tasks.
Cline is an autonomous AI coding assistant. Create clear, specific tasks that Cline can execute.
Focus on:
- Clear, actionable descriptions
- Proper prioritization
- Realistic time estimates
- Logical dependencies`;

    const prompt = `Generate a list of Cline tasks for this hackathon project:

Project Idea: ${project.idea}
Experience Level: ${project.experienceLevel}
Tech Stack: ${JSON.stringify(techStack, null, 2)}
Timeline: ${JSON.stringify(timeline, null, 2)}

Create 8-15 focused tasks that cover:
1. Project setup and scaffolding
2. Core feature implementation
3. UI/UX components
4. API integrations
5. Testing and debugging
6. Deployment

Each task should be specific enough for an AI assistant to execute.

Return your response as JSON with this structure:
{
  "tasks": [
    {
      "id": string (e.g., "task-1"),
      "title": string,
      "description": string,
      "priority": "high" | "medium" | "low",
      "estimatedMinutes": number,
      "dependencies": string[] (optional, array of task IDs)
    }
  ]
}`;

    const response = await this.ai.generateJSON<{ tasks: ClineTask[] }>(prompt, systemPrompt);
    return response.tasks;
  }
}
