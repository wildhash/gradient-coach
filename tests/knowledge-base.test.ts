import { KnowledgeBase } from '../src/utils/knowledge-base';

describe('KnowledgeBase', () => {
  let kb: KnowledgeBase;

  beforeEach(() => {
    kb = new KnowledgeBase();
  });

  describe('Tech Stack Templates', () => {
    test('should load tech stack templates', () => {
      const templates = kb.getAllTechStackTemplates();
      expect(templates).toBeDefined();
      expect(Object.keys(templates).length).toBeGreaterThan(0);
    });

    test('should get specific tech stack template', () => {
      const template = kb.getTechStackTemplate('web-app-fullstack');
      expect(template).toBeDefined();
      expect(template).not.toBeNull();
      if (template) {
        expect(template.name).toBe('Full-Stack Web Application');
        expect(template.frontend).toBeDefined();
        expect(template.backend).toBeDefined();
      }
    });

    test('should return null for non-existent template', () => {
      const template = kb.getTechStackTemplate('non-existent');
      expect(template).toBeNull();
    });

    test('should get quick picks for beginner level', () => {
      const picks = kb.getQuickPicksForExperience('beginner');
      expect(picks).toBeDefined();
      expect(Array.isArray(picks)).toBe(true);
      expect(picks.length).toBeGreaterThan(0);
    });

    test('should get quick picks for intermediate level', () => {
      const picks = kb.getQuickPicksForExperience('intermediate');
      expect(picks).toBeDefined();
      expect(Array.isArray(picks)).toBe(true);
      expect(picks.length).toBeGreaterThan(0);
    });

    test('should get quick picks for advanced level', () => {
      const picks = kb.getQuickPicksForExperience('advanced');
      expect(picks).toBeDefined();
      expect(Array.isArray(picks)).toBe(true);
      expect(picks.length).toBeGreaterThan(0);
    });

    test('should recommend template by keyword', () => {
      const recommendation = kb.getRecommendationByKeyword('build a dashboard application');
      expect(recommendation).toBeDefined();
      expect(recommendation).toBe('web-app-fullstack');
    });

    test('should recommend discord bot for chatbot keyword', () => {
      const recommendation = kb.getRecommendationByKeyword('create a chatbot');
      expect(recommendation).toBe('discord-bot');
    });

    test('should return null for unrecognized keyword', () => {
      const recommendation = kb.getRecommendationByKeyword('some random text without keywords');
      expect(recommendation).toBeNull();
    });
  });

  describe('Hackathon Guidelines', () => {
    test('should load hackathon guidelines', () => {
      const guidelines = kb.getHackathonGuidelines();
      expect(guidelines).toBeDefined();
      expect(guidelines.rules).toBeDefined();
      expect(guidelines['best-practices']).toBeDefined();
    });

    test('should get common mistakes', () => {
      const mistakes = kb.getCommonMistakes();
      expect(mistakes).toBeDefined();
      expect(Array.isArray(mistakes)).toBe(true);
      expect(mistakes.length).toBeGreaterThan(0);
    });

    test('should get best practices for planning', () => {
      const practices = kb.getBestPractices('planning');
      expect(practices).toBeDefined();
      expect(Array.isArray(practices)).toBe(true);
      expect(practices.length).toBeGreaterThan(0);
    });

    test('should get best practices for development', () => {
      const practices = kb.getBestPractices('development');
      expect(practices).toBeDefined();
      expect(Array.isArray(practices)).toBe(true);
      expect(practices.length).toBeGreaterThan(0);
    });

    test('should get time management guidelines', () => {
      const guidelines = kb.getTimeManagementGuidelines();
      expect(guidelines).toBeDefined();
      expect(Array.isArray(guidelines)).toBe(true);
      expect(guidelines.length).toBeGreaterThan(0);
    });

    test('should get judging criteria', () => {
      const criteria = kb.getJudgingCriteria();
      expect(criteria).toBeDefined();
      expect(criteria['common-categories']).toBeDefined();
      expect(Array.isArray(criteria['common-categories'])).toBe(true);
    });

    test('should get recommended APIs for AI/ML', () => {
      const apis = kb.getRecommendedAPIs('ai-ml');
      expect(apis).toBeDefined();
      expect(Array.isArray(apis)).toBe(true);
      expect(apis.length).toBeGreaterThan(0);
    });

    test('should get recommended APIs for database', () => {
      const apis = kb.getRecommendedAPIs('database');
      expect(apis).toBeDefined();
      expect(Array.isArray(apis)).toBe(true);
      expect(apis.length).toBeGreaterThan(0);
    });
  });

  describe('Context Generation', () => {
    test('should generate context for beginner', () => {
      const context = kb.getContextForPrompt('beginner');
      expect(context).toBeDefined();
      expect(typeof context).toBe('string');
      expect(context.length).toBeGreaterThan(0);
      expect(context).toContain('beginner');
      expect(context).toContain('Common Hackathon Mistakes');
    });

    test('should generate context for intermediate', () => {
      const context = kb.getContextForPrompt('intermediate');
      expect(context).toBeDefined();
      expect(typeof context).toBe('string');
      expect(context).toContain('intermediate');
    });

    test('should generate context for advanced', () => {
      const context = kb.getContextForPrompt('advanced');
      expect(context).toBeDefined();
      expect(typeof context).toBe('string');
      expect(context).toContain('advanced');
    });

    test('context should include best practices', () => {
      const context = kb.getContextForPrompt('intermediate');
      expect(context).toContain('Best Practices');
    });

    test('context should include time constraints', () => {
      const context = kb.getContextForPrompt('intermediate');
      expect(context).toContain('24 hours');
    });
  });
});
