import { ValidationError } from './errors';
import * as path from 'path';

/**
 * Validation utilities for user inputs
 */

export function validateExperienceLevel(level: string): 'beginner' | 'intermediate' | 'advanced' {
  const validLevels = ['beginner', 'intermediate', 'advanced'];
  const normalized = level.toLowerCase().trim();
  
  if (!validLevels.includes(normalized)) {
    throw new ValidationError(
      `Invalid experience level: "${level}". Must be one of: beginner, intermediate, advanced`
    );
  }
  
  return normalized as 'beginner' | 'intermediate' | 'advanced';
}

export function validateProjectIdea(idea: string): void {
  if (!idea || idea.trim().length === 0) {
    throw new ValidationError('Project idea cannot be empty');
  }
  
  if (idea.trim().length < 10) {
    throw new ValidationError('Project idea is too short. Please provide more details (at least 10 characters)');
  }
  
  if (idea.trim().length > 1000) {
    throw new ValidationError('Project idea is too long. Please keep it under 1000 characters');
  }
}

export function validateAPIKey(apiKey: string | undefined): void {
  if (!apiKey) {
    throw new ValidationError('API key is required');
  }
  
  if (apiKey.trim().length === 0) {
    throw new ValidationError('API key cannot be empty');
  }
  
  // Basic format check for Anthropic API keys (they start with 'sk-ant-')
  if (!apiKey.startsWith('sk-ant-')) {
    throw new ValidationError(
      'API key appears to be invalid. Anthropic API keys should start with "sk-ant-"'
    );
  }
  
  if (apiKey.length < 20) {
    throw new ValidationError('API key appears to be too short');
  }
}

export function validateOutputDirectory(dir: string): void {
  if (!dir || dir.trim().length === 0) {
    throw new ValidationError('Output directory cannot be empty');
  }
  
  // Resolve the path and check if it's within safe bounds
  const resolvedPath = path.resolve(dir);
  const cwd = process.cwd();
  
  // Check for potentially dangerous paths
  const dangerousPaths = ['/etc', '/sys', '/proc', '/dev', '/root'];
  for (const dangerous of dangerousPaths) {
    if (resolvedPath.startsWith(dangerous)) {
      throw new ValidationError('Invalid output directory path');
    }
  }
  
  // Ensure the resolved path is within or relative to current working directory
  // or is an absolute path in a safe location
  const relativePath = path.relative(cwd, resolvedPath);
  if (relativePath.startsWith('..') && !resolvedPath.startsWith('/tmp') && !resolvedPath.startsWith('/home')) {
    // Path goes outside cwd and is not in safe system locations
    throw new ValidationError('Invalid output directory path');
  }
}

export function validateFeatures(features: string[]): void {
  if (features.length > 20) {
    throw new ValidationError('Too many features specified. Please limit to 20 features for a 24-hour hackathon');
  }
  
  for (const feature of features) {
    if (feature.length > 200) {
      throw new ValidationError(`Feature description too long: "${feature.substring(0, 50)}...". Please keep under 200 characters`);
    }
  }
}
