import {
  GradientCoachError,
  APIKeyError,
  AIServiceError,
  ValidationError,
  FileSystemError,
  formatErrorForUser
} from '../src/utils/errors';

describe('Error Classes', () => {
  describe('GradientCoachError', () => {
    test('should create error with message', () => {
      const error = new GradientCoachError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('GradientCoachError');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('APIKeyError', () => {
    test('should create error with custom message', () => {
      const error = new APIKeyError('Custom API key error');
      expect(error.message).toBe('Custom API key error');
      expect(error.name).toBe('APIKeyError');
      expect(error instanceof GradientCoachError).toBe(true);
    });

    test('should use default message', () => {
      const error = new APIKeyError();
      expect(error.message).toBe('Invalid or missing API key');
    });
  });

  describe('AIServiceError', () => {
    test('should create error with message', () => {
      const error = new AIServiceError('AI service down');
      expect(error.message).toBe('AI service down');
      expect(error.name).toBe('AIServiceError');
    });

    test('should store original error', () => {
      const originalError = new Error('Network error');
      const error = new AIServiceError('AI failed', originalError);
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('ValidationError', () => {
    test('should create error with message', () => {
      const error = new ValidationError('Invalid input');
      expect(error.message).toBe('Invalid input');
      expect(error.name).toBe('ValidationError');
    });
  });

  describe('FileSystemError', () => {
    test('should create error with message', () => {
      const error = new FileSystemError('File not found');
      expect(error.message).toBe('File not found');
      expect(error.name).toBe('FileSystemError');
    });

    test('should store file path', () => {
      const error = new FileSystemError('Cannot read file', '/path/to/file');
      expect(error.path).toBe('/path/to/file');
    });
  });
});

describe('formatErrorForUser', () => {
  test('should format APIKeyError', () => {
    const error = new APIKeyError('Invalid key');
    const formatted = formatErrorForUser(error);
    expect(formatted).toContain('API Key Error');
    expect(formatted).toContain('ANTHROPIC_API_KEY');
    expect(formatted).toContain('console.anthropic.com');
  });

  test('should format AIServiceError', () => {
    const error = new AIServiceError('Service unavailable');
    const formatted = formatErrorForUser(error);
    expect(formatted).toContain('AI Service Error');
    expect(formatted).toContain('Service unavailable');
    expect(formatted).toContain('try again');
  });

  test('should format ValidationError', () => {
    const error = new ValidationError('Invalid input provided');
    const formatted = formatErrorForUser(error);
    expect(formatted).toContain('Validation Error');
    expect(formatted).toContain('Invalid input provided');
  });

  test('should format FileSystemError', () => {
    const error = new FileSystemError('Cannot write file', '/path/to/file');
    const formatted = formatErrorForUser(error);
    expect(formatted).toContain('File System Error');
    expect(formatted).toContain('Cannot write file');
    expect(formatted).toContain('/path/to/file');
  });

  test('should format FileSystemError without path', () => {
    const error = new FileSystemError('Cannot write file');
    const formatted = formatErrorForUser(error);
    expect(formatted).toContain('File System Error');
    expect(formatted).toContain('Cannot write file');
    expect(formatted).not.toContain('Path:');
  });

  test('should format generic GradientCoachError', () => {
    const error = new GradientCoachError('Custom error');
    const formatted = formatErrorForUser(error);
    expect(formatted).toContain('Error');
    expect(formatted).toContain('Custom error');
  });

  test('should handle unknown errors gracefully', () => {
    const error = new Error('Unknown system error');
    const formatted = formatErrorForUser(error);
    expect(formatted).toContain('unexpected error');
    expect(formatted).not.toContain('Unknown system error'); // Don't expose internal errors
  });

  test('should not expose stack traces in user messages', () => {
    const error = new Error('Internal error with stack');
    const formatted = formatErrorForUser(error);
    expect(formatted).not.toContain('at Object');
    expect(formatted).not.toContain('stack');
  });
});
