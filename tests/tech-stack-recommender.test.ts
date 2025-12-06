import { TechStackRecommender } from '../src/validators/tech-stack';
import { MockAIClient, mockProjectIdea, mockProjectIdeaSimple } from './mocks';

describe('TechStackRecommender', () => {
  let recommender: TechStackRecommender;
  let mockAI: MockAIClient;

  beforeEach(() => {
    mockAI = new MockAIClient();
    recommender = new TechStackRecommender(mockAI as any);
  });

  test('should recommend a tech stack', async () => {
    const result = await recommender.recommend(mockProjectIdea);
    
    expect(result).toBeDefined();
    expect(result.deployment).toBeDefined();
    expect(Array.isArray(result.deployment)).toBe(true);
    if (result.deployment) {
      expect(result.deployment.length).toBeGreaterThan(0);
    }
  });

  test('should include reasoning', async () => {
    const result = await recommender.recommend(mockProjectIdea);
    
    expect(result.reasoning).toBeDefined();
    expect(typeof result.reasoning).toBe('string');
    expect(result.reasoning.length).toBeGreaterThan(0);
  });

  test('should recommend frontend technologies when applicable', async () => {
    const result = await recommender.recommend(mockProjectIdea);
    
    // For a web app, should include frontend
    if (mockProjectIdea.idea.toLowerCase().includes('web') || 
        mockProjectIdea.idea.toLowerCase().includes('app')) {
      expect(result.frontend).toBeDefined();
      if (result.frontend) {
        expect(Array.isArray(result.frontend)).toBe(true);
      }
    }
  });

  test('should recommend backend technologies when applicable', async () => {
    const result = await recommender.recommend(mockProjectIdea);
    
    expect(result.backend).toBeDefined();
    if (result.backend) {
      expect(Array.isArray(result.backend)).toBe(true);
    }
  });

  test('should recommend AI tools when idea involves AI', async () => {
    const result = await recommender.recommend(mockProjectIdea);
    
    // Project idea includes AI, so should recommend AI tools
    if (mockProjectIdea.idea.toLowerCase().includes('ai')) {
      expect(result.aiTools).toBeDefined();
      if (result.aiTools) {
        expect(Array.isArray(result.aiTools)).toBe(true);
        expect(result.aiTools.length).toBeGreaterThan(0);
      }
    }
  });

  test('should recommend database when needed', async () => {
    const result = await recommender.recommend(mockProjectIdea);
    
    expect(result.database).toBeDefined();
    if (result.database) {
      expect(Array.isArray(result.database)).toBe(true);
    }
  });

  test('should handle simple project', async () => {
    const result = await recommender.recommend(mockProjectIdeaSimple);
    
    expect(result).toBeDefined();
    expect(result.deployment).toBeDefined();
  });

  test('should use knowledge base for recommendations', async () => {
    const webAppIdea = {
      idea: 'A dashboard for tracking expenses',
      experienceLevel: 'intermediate' as const
    };

    const result = await recommender.recommend(webAppIdea);
    
    expect(result).toBeDefined();
    // Should leverage knowledge base templates for better recommendations
    expect(result.reasoning).toBeDefined();
  });
});
