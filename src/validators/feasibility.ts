import { ProjectIdea, FeasibilityResult } from '../types';
import { GradientAIClient } from '../utils/ai-client';
import { KnowledgeBase } from '../utils/knowledge-base';

export class FeasibilityValidator {
  private ai: GradientAIClient;
  private kb: KnowledgeBase;

  constructor(ai: GradientAIClient) {
    this.ai = ai;
    this.kb = new KnowledgeBase();
  }

  async validate(project: ProjectIdea): Promise<FeasibilityResult> {
    const commonMistakes = this.kb.getCommonMistakes();
    const timeGuidelines = this.kb.getTimeManagementGuidelines();
    
    const systemPrompt = `You are an expert hackathon mentor who specializes in validating project feasibility for 24-hour hackathons. 
You understand the constraints of limited time and need to be realistic about what can be accomplished.
Consider the builder's experience level when making recommendations.

Common Hackathon Mistakes to Watch For:
${commonMistakes.map(m => `- ${m}`).join('\n')}

Time Management Reference:
${timeGuidelines.slice(0, 3).map(g => `- ${g}`).join('\n')}`;

    const prompt = `Analyze this hackathon project idea and determine if it's feasible to build in 24 hours:

Project Idea: ${project.idea}
Builder Experience Level: ${project.experienceLevel}
${project.features ? `Desired Features: ${project.features.join(', ')}` : ''}
${project.constraints ? `Constraints: ${project.constraints.join(', ')}` : ''}

Provide a feasibility assessment with:
1. Whether it's feasible (true/false)
2. Risk level (low/medium/high)
3. Specific concerns or potential blockers
4. Recommendations to improve feasibility
5. Realistic estimated hours needed

Return your response as JSON with this structure:
{
  "isFeasible": boolean,
  "riskLevel": "low" | "medium" | "high",
  "concerns": string[],
  "recommendations": string[],
  "estimatedHours": number
}`;

    return await this.ai.generateJSON<FeasibilityResult>(prompt, systemPrompt);
  }
}
