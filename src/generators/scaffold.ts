import { ProjectIdea, TechStack } from '../types';
import { GradientAIClient } from '../utils/ai-client';

export class ScaffoldGenerator {
  private ai: GradientAIClient;

  constructor(ai: GradientAIClient) {
    this.ai = ai;
  }

  async generate(
    project: ProjectIdea,
    techStack: TechStack
  ): Promise<Record<string, string>> {
    const systemPrompt = `You are an expert at generating minimal, production-ready project scaffolds.
Create only the essential files needed to get started quickly.
Include proper configuration, a clear README, and starter code.`;

    const prompt = `Generate a repository scaffold for this hackathon project:

Project Idea: ${project.idea}
Tech Stack: ${JSON.stringify(techStack, null, 2)}

Generate key files including:
- README.md with setup instructions
- Configuration files (package.json, tsconfig.json, etc.)
- Starter code for main components
- .gitignore
- Environment variable template (.env.example)

Keep files minimal but functional. Focus on getting the builder started fast.

Return your response as JSON with this structure:
{
  "files": {
    "filename": "file content as string",
    "path/to/file": "file content"
  }
}

For multiline file content, use \\n for line breaks.`;

    const response = await this.ai.generateJSON<{ files: Record<string, string> }>(
      prompt,
      systemPrompt,
      8192
    );
    return response.files;
  }
}
