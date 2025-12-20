/**
 * Custom error classes for Gradient Coach
 * Provides better error handling and user-friendly messages
 */

export class GradientCoachError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GradientCoachError';
  }
}

export class APIKeyError extends GradientCoachError {
  constructor(message: string = 'Invalid or missing API key') {
    super(message);
    this.name = 'APIKeyError';
  }
}

export class AIServiceError extends GradientCoachError {
  constructor(message: string, public readonly originalError?: Error) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class ValidationError extends GradientCoachError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class FileSystemError extends GradientCoachError {
  constructor(message: string, public readonly path?: string) {
    super(message);
    this.name = 'FileSystemError';
  }
}

/**
 * Format error for user display (hide internal details)
 */
export function formatErrorForUser(error: Error): string {
  if (error instanceof APIKeyError) {
    return `❌ API Key Error: ${error.message}\n\nPlease ensure your ANTHROPIC_API_KEY is set correctly:\n  export ANTHROPIC_API_KEY=your-api-key-here\n\nGet your key from: https://console.anthropic.com/`;
  }

  if (error instanceof AIServiceError) {
    return `❌ AI Service Error: ${error.message}\n\nThis might be due to:\n  - Network connectivity issues\n  - API rate limits\n  - Invalid API key\n  - Service unavailability\n\nPlease try again in a moment.`;
  }

  if (error instanceof ValidationError) {
    return `❌ Validation Error: ${error.message}`;
  }

  if (error instanceof FileSystemError) {
    return `❌ File System Error: ${error.message}${error.path ? `\nPath: ${error.path}` : ''}`;
  }

  if (error instanceof GradientCoachError) {
    return `❌ Error: ${error.message}`;
  }

  // Generic error - don't expose internal details
  return `❌ An unexpected error occurred. Please try again or check the documentation.\n\nIf the problem persists, please report this issue.`;
}
