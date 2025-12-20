import { validateCoachOutput, validateJSONOutput, validateFileContent } from '../src/utils/output-validation';
import { ValidationError } from '../src/utils/errors';
import { CoachOutput } from '../src/types';

describe('Output Validation', () => {
  describe('validateCoachOutput', () => {
    const createValidOutput = (): CoachOutput => ({
      feasibility: {
        isFeasible: true,
        riskLevel: 'medium',
        concerns: [],
        recommendations: [],
        estimatedHours: 18,
      },
      techStack: {
        frontend: ['React'],
        backend: ['Node.js'],
        reasoning: 'Fast setup and well-documented',
      },
      timeline: {
        phases: [
          {
            name: 'Setup',
            description: 'Project setup',
            hours: 2,
            tasks: ['Initialize project'],
          },
        ],
        totalHours: 18,
      },
      clineTasks: [
        {
          id: 'task-1',
          title: 'Setup project',
          description: 'Initialize the project',
          priority: 'high',
          estimatedMinutes: 60,
        },
      ],
      pitch: {
        title: 'Test Project',
        tagline: 'A test project',
        problem: 'Testing needs',
        solution: 'Test solution',
        techHighlights: ['React', 'Node.js'],
      },
    });

    test('should validate valid output', () => {
      const output = createValidOutput();
      expect(() => validateCoachOutput(output)).not.toThrow();
    });

    test('should throw if feasibility is missing', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.feasibility = undefined;
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if isFeasible is not boolean', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.feasibility.isFeasible = 'yes';
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if risk level is invalid', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.feasibility.riskLevel = 'extreme';
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if estimated hours is not positive', () => {
      const output = createValidOutput();
      output.feasibility.estimatedHours = 0;
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if tech stack is missing', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.techStack = undefined;
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if tech stack reasoning is empty', () => {
      const output = createValidOutput();
      output.techStack.reasoning = '';
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if timeline is missing', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.timeline = undefined;
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if timeline has no phases', () => {
      const output = createValidOutput();
      output.timeline.phases = [];
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if timeline total hours is not positive', () => {
      const output = createValidOutput();
      output.timeline.totalHours = -5;
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if phase is missing name or description', () => {
      const output = createValidOutput();
      output.timeline.phases[0].name = '';
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if phase hours is not positive', () => {
      const output = createValidOutput();
      output.timeline.phases[0].hours = 0;
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if phase has no tasks', () => {
      const output = createValidOutput();
      output.timeline.phases[0].tasks = [];
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if Cline tasks are missing', () => {
      const output = createValidOutput();
      output.clineTasks = [];
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if Cline task is missing required fields', () => {
      const output = createValidOutput();
      output.clineTasks[0].id = '';
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if Cline task priority is invalid', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.clineTasks[0].priority = 'urgent';
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if Cline task estimated minutes is not positive', () => {
      const output = createValidOutput();
      output.clineTasks[0].estimatedMinutes = 0;
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if pitch is missing', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.pitch = undefined;
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if pitch title is empty', () => {
      const output = createValidOutput();
      output.pitch.title = '';
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if pitch has no tech highlights', () => {
      const output = createValidOutput();
      output.pitch.techHighlights = [];
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should validate output with scaffold files', () => {
      const output = createValidOutput();
      output.scaffoldFiles = {
        'README.md': '# Test',
        'package.json': '{}',
      };
      expect(() => validateCoachOutput(output)).not.toThrow();
    });

    test('should throw if scaffold files is not an object', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.scaffoldFiles = 'invalid';
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if scaffold files is empty object', () => {
      const output = createValidOutput();
      output.scaffoldFiles = {};
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if scaffold filename is empty', () => {
      const output = createValidOutput();
      output.scaffoldFiles = { '': 'content' };
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });

    test('should throw if scaffold content is not string', () => {
      const output = createValidOutput();
      // @ts-ignore
      output.scaffoldFiles = { 'file.txt': 123 };
      expect(() => validateCoachOutput(output)).toThrow(ValidationError);
    });
  });

  describe('validateJSONOutput', () => {
    test('should validate valid JSON', () => {
      expect(() => validateJSONOutput('{"key": "value"}')).not.toThrow();
      expect(() => validateJSONOutput('[]')).not.toThrow();
    });

    test('should throw for empty JSON', () => {
      expect(() => validateJSONOutput('')).toThrow(ValidationError);
      expect(() => validateJSONOutput('   ')).toThrow(ValidationError);
    });

    test('should throw for invalid JSON', () => {
      expect(() => validateJSONOutput('not json')).toThrow(ValidationError);
      expect(() => validateJSONOutput('{invalid}')).toThrow(ValidationError);
    });
  });

  describe('validateFileContent', () => {
    test('should validate non-empty content', () => {
      expect(() => validateFileContent('Some content', 'test.txt')).not.toThrow();
    });

    test('should throw for empty content', () => {
      expect(() => validateFileContent('', 'test.txt')).toThrow(ValidationError);
      expect(() => validateFileContent('   ', 'test.txt')).toThrow(ValidationError);
    });

    test('should throw for content with placeholders', () => {
      expect(() => validateFileContent('TODO: Add content', 'test.txt')).toThrow(ValidationError);
      expect(() => validateFileContent('PLACEHOLDER text', 'test.txt')).toThrow(ValidationError);
      expect(() => validateFileContent('INSERT_VALUE_HERE', 'test.txt')).toThrow(ValidationError);
    });
  });
});
