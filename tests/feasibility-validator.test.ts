import { FeasibilityValidator } from '../src/validators/feasibility';
import { MockAIClient, mockProjectIdea, mockProjectIdeaSimple, mockProjectIdeaComplex } from './mocks';

describe('FeasibilityValidator', () => {
  let validator: FeasibilityValidator;
  let mockAI: MockAIClient;

  beforeEach(() => {
    mockAI = new MockAIClient();
    validator = new FeasibilityValidator(mockAI as any);
  });

  test('should validate a project idea', async () => {
    const result = await validator.validate(mockProjectIdea);
    
    expect(result).toBeDefined();
    expect(result.isFeasible).toBeDefined();
    expect(typeof result.isFeasible).toBe('boolean');
    expect(result.riskLevel).toBeDefined();
    expect(['low', 'medium', 'high']).toContain(result.riskLevel);
  });

  test('should return concerns array', async () => {
    const result = await validator.validate(mockProjectIdea);
    
    expect(result.concerns).toBeDefined();
    expect(Array.isArray(result.concerns)).toBe(true);
  });

  test('should return recommendations array', async () => {
    const result = await validator.validate(mockProjectIdea);
    
    expect(result.recommendations).toBeDefined();
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  test('should return estimated hours', async () => {
    const result = await validator.validate(mockProjectIdea);
    
    expect(result.estimatedHours).toBeDefined();
    expect(typeof result.estimatedHours).toBe('number');
    expect(result.estimatedHours).toBeGreaterThan(0);
    expect(result.estimatedHours).toBeLessThanOrEqual(24);
  });

  test('should handle simple project idea', async () => {
    const result = await validator.validate(mockProjectIdeaSimple);
    
    expect(result).toBeDefined();
    expect(result.isFeasible).toBe(true);
  });

  test('should handle complex project idea', async () => {
    const result = await validator.validate(mockProjectIdeaComplex);
    
    expect(result).toBeDefined();
    // Complex projects might not be feasible or have high risk
    expect(result.riskLevel).toBeDefined();
  });

  test('should include knowledge base context in validation', async () => {
    const result = await validator.validate(mockProjectIdea);
    
    // The validator should use knowledge base which provides better context
    expect(result.recommendations.length).toBeGreaterThan(0);
  });
});
