import { 
  validateExperienceLevel, 
  validateProjectIdea, 
  validateAPIKey, 
  validateOutputDirectory,
  validateFeatures 
} from '../src/utils/validation';
import { ValidationError } from '../src/utils/errors';

describe('Validation Utilities', () => {
  describe('validateExperienceLevel', () => {
    test('should accept valid experience levels', () => {
      expect(validateExperienceLevel('beginner')).toBe('beginner');
      expect(validateExperienceLevel('intermediate')).toBe('intermediate');
      expect(validateExperienceLevel('advanced')).toBe('advanced');
    });

    test('should normalize case', () => {
      expect(validateExperienceLevel('BEGINNER')).toBe('beginner');
      expect(validateExperienceLevel('Intermediate')).toBe('intermediate');
      expect(validateExperienceLevel(' Advanced ')).toBe('advanced');
    });

    test('should throw ValidationError for invalid level', () => {
      expect(() => validateExperienceLevel('expert')).toThrow(ValidationError);
      expect(() => validateExperienceLevel('novice')).toThrow(ValidationError);
      expect(() => validateExperienceLevel('')).toThrow(ValidationError);
    });
  });

  describe('validateProjectIdea', () => {
    test('should accept valid project ideas', () => {
      expect(() => validateProjectIdea('A Chrome extension for productivity')).not.toThrow();
      expect(() => validateProjectIdea('Build a mobile app for tracking habits')).not.toThrow();
    });

    test('should throw ValidationError for empty idea', () => {
      expect(() => validateProjectIdea('')).toThrow(ValidationError);
      expect(() => validateProjectIdea('   ')).toThrow(ValidationError);
    });

    test('should throw ValidationError for too short idea', () => {
      expect(() => validateProjectIdea('Too short')).toThrow(ValidationError);
      expect(() => validateProjectIdea('a')).toThrow(ValidationError);
    });

    test('should throw ValidationError for too long idea', () => {
      const longIdea = 'a'.repeat(1001);
      expect(() => validateProjectIdea(longIdea)).toThrow(ValidationError);
    });

    test('should accept ideas at boundary lengths', () => {
      const minIdea = 'a'.repeat(10);
      const maxIdea = 'a'.repeat(1000);
      expect(() => validateProjectIdea(minIdea)).not.toThrow();
      expect(() => validateProjectIdea(maxIdea)).not.toThrow();
    });
  });

  describe('validateAPIKey', () => {
    test('should accept valid Anthropic API key format', () => {
      expect(() => validateAPIKey('sk-ant-1234567890abcdefghij')).not.toThrow();
      expect(() => validateAPIKey('sk-ant-api03-abcdefghijklmnopqrstuvwxyz123456')).not.toThrow();
    });

    test('should throw ValidationError for missing key', () => {
      expect(() => validateAPIKey(undefined)).toThrow(ValidationError);
    });

    test('should throw ValidationError for empty key', () => {
      expect(() => validateAPIKey('')).toThrow(ValidationError);
      expect(() => validateAPIKey('   ')).toThrow(ValidationError);
    });

    test('should throw ValidationError for invalid format', () => {
      expect(() => validateAPIKey('invalid-key')).toThrow(ValidationError);
      expect(() => validateAPIKey('api-key-123456')).toThrow(ValidationError);
    });

    test('should throw ValidationError for too short key', () => {
      expect(() => validateAPIKey('sk-ant-123')).toThrow(ValidationError);
    });
  });

  describe('validateOutputDirectory', () => {
    test('should accept valid output directories', () => {
      expect(() => validateOutputDirectory('./output')).not.toThrow();
      expect(() => validateOutputDirectory('/tmp/gradient-coach')).not.toThrow();
      expect(() => validateOutputDirectory('my-project/output')).not.toThrow();
    });

    test('should throw ValidationError for empty directory', () => {
      expect(() => validateOutputDirectory('')).toThrow(ValidationError);
      expect(() => validateOutputDirectory('   ')).toThrow(ValidationError);
    });

    test('should throw ValidationError for dangerous paths', () => {
      expect(() => validateOutputDirectory('../../../etc')).toThrow(ValidationError);
      expect(() => validateOutputDirectory('/etc/config')).toThrow(ValidationError);
      expect(() => validateOutputDirectory('/sys/kernel')).toThrow(ValidationError);
    });
  });

  describe('validateFeatures', () => {
    test('should accept valid feature lists', () => {
      expect(() => validateFeatures(['feature1', 'feature2'])).not.toThrow();
      expect(() => validateFeatures(['user authentication', 'real-time updates'])).not.toThrow();
      expect(() => validateFeatures([])).not.toThrow();
    });

    test('should throw ValidationError for too many features', () => {
      const tooManyFeatures = Array(21).fill('feature');
      expect(() => validateFeatures(tooManyFeatures)).toThrow(ValidationError);
    });

    test('should throw ValidationError for too long feature description', () => {
      const longFeature = 'a'.repeat(201);
      expect(() => validateFeatures([longFeature])).toThrow(ValidationError);
    });

    test('should accept features at boundary length', () => {
      const maxFeatures = Array(20).fill('feature');
      expect(() => validateFeatures(maxFeatures)).not.toThrow();
      
      const longFeature = 'a'.repeat(200);
      expect(() => validateFeatures([longFeature])).not.toThrow();
    });
  });
});
