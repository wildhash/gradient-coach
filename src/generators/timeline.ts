import { ProjectIdea, Timeline, TechStack } from '../types';
import { GradientAIClient } from '../utils/ai-client';

export class TimelineGenerator {
  private ai: GradientAIClient;

  constructor(ai: GradientAIClient) {
    this.ai = ai;
  }

  async generate(
    project: ProjectIdea,
    techStack: TechStack,
    estimatedHours: number
  ): Promise<Timeline> {
    const systemPrompt = `You are an expert project manager for hackathons who creates realistic, actionable timelines.
Break down the 24-hour period into clear phases with specific tasks.
Account for breaks, debugging time, and deployment.`;

    const prompt = `Create a detailed timeline for this hackathon project:

Project Idea: ${project.idea}
Experience Level: ${project.experienceLevel}
Estimated Hours: ${estimatedHours}
Tech Stack: ${JSON.stringify(techStack, null, 2)}

Create a timeline broken into phases (e.g., Setup, Core Features, Polish, Deploy).
Each phase should have specific tasks and realistic time estimates.

Return your response as JSON with this structure:
{
  "phases": [
    {
      "name": string,
      "description": string,
      "hours": number,
      "tasks": string[]
    }
  ],
  "totalHours": number
}`;

    return await this.ai.generateJSON<Timeline>(prompt, systemPrompt);
  }
}
