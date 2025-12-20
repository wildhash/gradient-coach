import { ValidationError } from './errors';
import { CoachOutput } from '../types';

/**
 * Validation utilities for generated outputs
 */

export function validateCoachOutput(output: CoachOutput): void {
  // Validate feasibility
  if (!output.feasibility) {
    throw new ValidationError('Output missing feasibility assessment');
  }
  if (typeof output.feasibility.isFeasible !== 'boolean') {
    throw new ValidationError('Feasibility isFeasible must be a boolean');
  }
  if (!['low', 'medium', 'high'].includes(output.feasibility.riskLevel)) {
    throw new ValidationError('Feasibility risk level must be low, medium, or high');
  }
  if (typeof output.feasibility.estimatedHours !== 'number' || output.feasibility.estimatedHours <= 0) {
    throw new ValidationError('Feasibility estimated hours must be a positive number');
  }

  // Validate tech stack
  if (!output.techStack) {
    throw new ValidationError('Output missing tech stack');
  }
  if (!output.techStack.reasoning || output.techStack.reasoning.length === 0) {
    throw new ValidationError('Tech stack must include reasoning');
  }

  // Validate timeline
  if (!output.timeline) {
    throw new ValidationError('Output missing timeline');
  }
  if (!Array.isArray(output.timeline.phases) || output.timeline.phases.length === 0) {
    throw new ValidationError('Timeline must have at least one phase');
  }
  if (typeof output.timeline.totalHours !== 'number' || output.timeline.totalHours <= 0) {
    throw new ValidationError('Timeline total hours must be a positive number');
  }

  // Validate each phase
  for (const phase of output.timeline.phases) {
    if (!phase.name || !phase.description) {
      throw new ValidationError('Each timeline phase must have name and description');
    }
    if (typeof phase.hours !== 'number' || phase.hours <= 0) {
      throw new ValidationError('Each timeline phase must have positive hours');
    }
    if (!Array.isArray(phase.tasks) || phase.tasks.length === 0) {
      throw new ValidationError('Each timeline phase must have at least one task');
    }
  }

  // Validate Cline tasks
  if (!Array.isArray(output.clineTasks) || output.clineTasks.length === 0) {
    throw new ValidationError('Output must include at least one Cline task');
  }

  for (const task of output.clineTasks) {
    if (!task.id || !task.title || !task.description) {
      throw new ValidationError('Each Cline task must have id, title, and description');
    }
    if (!['high', 'medium', 'low'].includes(task.priority)) {
      throw new ValidationError('Cline task priority must be high, medium, or low');
    }
    if (typeof task.estimatedMinutes !== 'number' || task.estimatedMinutes <= 0) {
      throw new ValidationError('Cline task estimated minutes must be a positive number');
    }
  }

  // Validate pitch
  if (!output.pitch) {
    throw new ValidationError('Output missing pitch');
  }
  if (!output.pitch.title || output.pitch.title.length === 0) {
    throw new ValidationError('Pitch must have a title');
  }
  if (!output.pitch.tagline || output.pitch.tagline.length === 0) {
    throw new ValidationError('Pitch must have a tagline');
  }
  if (!output.pitch.problem || output.pitch.problem.length === 0) {
    throw new ValidationError('Pitch must describe the problem');
  }
  if (!output.pitch.solution || output.pitch.solution.length === 0) {
    throw new ValidationError('Pitch must describe the solution');
  }
  if (!Array.isArray(output.pitch.techHighlights) || output.pitch.techHighlights.length === 0) {
    throw new ValidationError('Pitch must include tech highlights');
  }

  // Validate scaffold files if present
  if (output.scaffoldFiles) {
    if (typeof output.scaffoldFiles !== 'object') {
      throw new ValidationError('Scaffold files must be an object');
    }
    if (Object.keys(output.scaffoldFiles).length === 0) {
      throw new ValidationError('Scaffold files object cannot be empty if provided');
    }
    
    // Validate each file
    for (const [filename, content] of Object.entries(output.scaffoldFiles)) {
      if (!filename || filename.length === 0) {
        throw new ValidationError('Scaffold filenames cannot be empty');
      }
      if (typeof content !== 'string') {
        throw new ValidationError(`Scaffold file content must be string: ${filename}`);
      }
    }
  }
}

export function validateJSONOutput(json: string): void {
  if (!json || json.trim().length === 0) {
    throw new ValidationError('JSON output cannot be empty');
  }

  try {
    JSON.parse(json);
  } catch (error) {
    throw new ValidationError('Output is not valid JSON');
  }
}

export function validateFileContent(content: string, filename: string): void {
  if (!content || content.trim().length === 0) {
    throw new ValidationError(`File content cannot be empty: ${filename}`);
  }

  // Check for common generation errors
  if (content.includes('undefined') && content.includes('null')) {
    throw new ValidationError(`File appears to have generation errors: ${filename}`);
  }

  // Check for placeholder text that wasn't replaced
  if (content.includes('TODO:') || content.includes('PLACEHOLDER') || content.includes('INSERT_')) {
    throw new ValidationError(`File contains unresolved placeholders: ${filename}`);
  }
}
