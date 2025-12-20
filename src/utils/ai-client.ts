import Anthropic from '@anthropic-ai/sdk';
import { AIServiceError, APIKeyError } from './errors';
import { validateAPIKey } from './validation';
import { logger } from './logger';

export class GradientAIClient {
  private client: Anthropic;
  private maxRetries: number = 3;
  private retryDelayMs: number = 1000;
  private maxRetryDelayMs: number = 10000; // Cap at 10 seconds

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ANTHROPIC_API_KEY || '';
    
    // Validate API key on construction
    try {
      validateAPIKey(key);
    } catch (error) {
      throw new APIKeyError((error as Error).message);
    }

    this.client = new Anthropic({
      apiKey: key,
      baseURL: process.env.GRADIENT_AI_BASE_URL || 'https://api.anthropic.com',
    });
  }

  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
    maxTokens: number = 4096
  ): Promise<string> {
    return this.withRetry(async () => {
      try {
        logger.debug(`Generating completion (max tokens: ${maxTokens})`);
        
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
          logger.debug(`Completion generated successfully (${content.text.length} chars)`);
          return content.text;
        }
        throw new AIServiceError('Unexpected response format from AI service');
      } catch (error: any) {
        logger.debug(`AI completion error: ${error.message}`);
        
        // Handle specific Anthropic errors
        if (error.status === 401) {
          throw new APIKeyError('Invalid API key. Please check your ANTHROPIC_API_KEY');
        }
        if (error.status === 429) {
          throw new AIServiceError('Rate limit exceeded. Please try again in a moment');
        }
        if (error.status === 500 || error.status === 503) {
          throw new AIServiceError('AI service temporarily unavailable. Please try again');
        }
        
        throw new AIServiceError(
          'Failed to generate AI completion. Please check your connection and try again',
          error
        );
      }
    });
  }

  private async withRetry<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on auth errors or validation errors
        if (error instanceof APIKeyError) {
          throw error;
        }
        
        // Only retry on service errors
        if (error instanceof AIServiceError && attempt < this.maxRetries) {
          const delay = Math.min(
            this.maxRetryDelayMs,
            this.retryDelayMs * Math.pow(2, attempt - 1)
          );
          logger.debug(`Retry attempt ${attempt}/${this.maxRetries} after ${delay}ms`);
          await this.sleep(delay);
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
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
      logger.debug(`Failed to parse JSON. Response: ${response.substring(0, 200)}...`);
      throw new AIServiceError(
        'Failed to parse AI response. The service may be experiencing issues',
        error as Error
      );
    }
  }
}
