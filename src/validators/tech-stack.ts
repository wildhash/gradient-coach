import { ProjectIdea, TechStack } from '../types';
import { GradientAIClient } from '../utils/ai-client';

export class TechStackRecommender {
  private ai: GradientAIClient;

  constructor(ai: GradientAIClient) {
    this.ai = ai;
  }

  async recommend(project: ProjectIdea): Promise<TechStack> {
    const systemPrompt = `You are an expert in hackathon tech stacks who recommends the leanest, fastest-to-ship technologies.
Prioritize:
- Technologies that are quick to set up
- Minimal boilerplate
- Good documentation
- Popular, well-supported libraries
- Technologies matching the builder's experience level
- Focus on shipping a working demo, not production-ready code`;

    const prompt = `Recommend an ultra-lean tech stack for this hackathon project:

Project Idea: ${project.idea}
Builder Experience Level: ${project.experienceLevel}
${project.features ? `Desired Features: ${project.features.join(', ')}` : ''}

Focus on technologies that will help ship a demo FAST (within 24 hours). Keep it minimal.

Return your response as JSON with this structure:
{
  "frontend": string[] (optional, array of technologies),
  "backend": string[] (optional, array of technologies),
  "database": string[] (optional, array of technologies),
  "deployment": string[] (array of deployment platforms),
  "aiTools": string[] (optional, array of AI tools/APIs),
  "reasoning": string (brief explanation of why this stack is optimal for this project)
}`;

    return await this.ai.generateJSON<TechStack>(prompt, systemPrompt);
  }
}
