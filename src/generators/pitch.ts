import { ProjectIdea, Pitch, TechStack } from '../types';
import { GradientAIClient } from '../utils/ai-client';

export class PitchGenerator {
  private ai: GradientAIClient;

  constructor(ai: GradientAIClient) {
    this.ai = ai;
  }

  async generate(project: ProjectIdea, techStack: TechStack): Promise<Pitch> {
    const systemPrompt = `You are an expert hackathon pitch coach who creates compelling, concise pitches.
Your pitches are:
- Clear and concise (under 100 words for tagline/problem/solution)
- Focused on impact and innovation
- Highlighting technical achievements
- Memorable and engaging`;

    const prompt = `Create a compelling hackathon pitch for this project:

Project Idea: ${project.idea}
Tech Stack: ${JSON.stringify(techStack, null, 2)}

Create a pitch that would impress hackathon judges. Keep it concise but impactful.

Return your response as JSON with this structure:
{
  "title": string (catchy project name, 2-4 words),
  "tagline": string (one sentence that captures the essence),
  "problem": string (2-3 sentences about the problem being solved),
  "solution": string (2-3 sentences about how your project solves it),
  "techHighlights": string[] (3-5 impressive technical features or innovations)
}`;

    return await this.ai.generateJSON<Pitch>(prompt, systemPrompt);
  }
}
