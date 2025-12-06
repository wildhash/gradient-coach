import Anthropic from '@anthropic-ai/sdk';

export class GradientAIClient {
  private client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY || '',
      baseURL: process.env.GRADIENT_AI_BASE_URL || 'https://api.anthropic.com',
    });
  }

  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
    maxTokens: number = 4096
  ): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        return content.text;
      }
      throw new Error('Unexpected response format');
    } catch (error) {
      throw new Error(`AI completion failed: ${error}`);
    }
  }

  async generateJSON<T>(
    prompt: string,
    systemPrompt: string,
    maxTokens: number = 4096
  ): Promise<T> {
    const fullPrompt = `${prompt}\n\nRespond with valid JSON only. Do not include any markdown formatting or explanations.`;
    const response = await this.generateCompletion(fullPrompt, systemPrompt, maxTokens);
    
    // Extract JSON from markdown code blocks if present
    let jsonText = response.trim();
    const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      const codeMatch = jsonText.match(/```\n([\s\S]*?)\n```/);
      if (codeMatch) {
        jsonText = codeMatch[1];
      }
    }
    
    try {
      return JSON.parse(jsonText);
    } catch (error) {
      throw new Error(`Failed to parse JSON response: ${error}\n\nResponse: ${response}`);
    }
  }
}
