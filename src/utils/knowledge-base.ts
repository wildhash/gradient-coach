import * as fs from 'fs';
import * as path from 'path';
import { FileSystemError } from './errors';
import { logger } from './logger';

interface TechStackTemplate {
  name: string;
  description: string;
  [key: string]: any;
}

interface TechStacksData {
  templates: Record<string, TechStackTemplate>;
  quickPicks: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  recommendations: Record<string, string>;
}

interface GuidelinesData {
  rules: {
    'common-mistakes': string[];
    'judging-criteria': {
      'common-categories': string[];
      [key: string]: any;
    };
  };
  'best-practices': {
    planning: string[];
    development: string[];
    'demo-preparation': string[];
    'time-management': string[];
  };
  'api-integrations': {
    'recommended-apis': Record<string, string[]>;
  };
}

/**
 * Knowledge Base Loader
 * Provides access to curated templates, guidelines, and best practices
 */
export class KnowledgeBase {
  private techStacksData: TechStacksData;
  private guidelinesData: GuidelinesData;

  constructor() {
    this.techStacksData = this.getDefaultTechStacks();
    this.guidelinesData = this.getDefaultGuidelines();
    this.loadKnowledgeBase();
  }

  private getDefaultTechStacks(): TechStacksData {
    return {
      templates: {},
      quickPicks: { beginner: [], intermediate: [], advanced: [] },
      recommendations: {}
    };
  }

  private getDefaultGuidelines(): GuidelinesData {
    return {
      rules: {
        'common-mistakes': [],
        'judging-criteria': { 'common-categories': [] }
      },
      'best-practices': {
        'planning': [],
        'development': [],
        'demo-preparation': [],
        'time-management': []
      },
      'api-integrations': {
        'recommended-apis': {}
      }
    };
  }

  private loadKnowledgeBase(): void {
    try {
      const techStacksPath = path.join(__dirname, '../knowledge/tech-stacks.json');
      const guidelinesPath = path.join(__dirname, '../knowledge/mlh-guidelines.json');

      if (!fs.existsSync(techStacksPath)) {
        throw new FileSystemError('Tech stacks knowledge base file not found', techStacksPath);
      }

      if (!fs.existsSync(guidelinesPath)) {
        throw new FileSystemError('Guidelines knowledge base file not found', guidelinesPath);
      }

      this.techStacksData = JSON.parse(fs.readFileSync(techStacksPath, 'utf-8'));
      this.guidelinesData = JSON.parse(fs.readFileSync(guidelinesPath, 'utf-8'));
      
      logger.debug('Knowledge base loaded successfully');
    } catch (error) {
      logger.warning('Could not load knowledge base files. Using defaults.');
      logger.debug(`Knowledge base error: ${(error as Error).message}`);
      // Keep defaults set in constructor
    }
  }

  /**
   * Get a tech stack template by ID
   */
  getTechStackTemplate(templateId: string): TechStackTemplate | null {
    return this.techStacksData.templates[templateId] || null;
  }

  /**
   * Get recommended tech stack templates based on experience level
   */
  getQuickPicksForExperience(experienceLevel: 'beginner' | 'intermediate' | 'advanced'): string[] {
    return this.techStacksData.quickPicks[experienceLevel] || [];
  }

  /**
   * Get tech stack recommendation based on project keywords
   */
  getRecommendationByKeyword(idea: string): string | null {
    const lowerIdea = idea.toLowerCase();
    for (const [keyword, templateId] of Object.entries(this.techStacksData.recommendations)) {
      if (lowerIdea.includes(keyword)) {
        return templateId;
      }
    }
    return null;
  }

  /**
   * Get all tech stack templates
   */
  getAllTechStackTemplates(): Record<string, TechStackTemplate> {
    return this.techStacksData.templates;
  }

  /**
   * Get MLH hackathon guidelines
   */
  getHackathonGuidelines(): GuidelinesData {
    return this.guidelinesData;
  }

  /**
   * Get best practices for a specific area
   */
  getBestPractices(area: 'planning' | 'development' | 'demo-preparation' | 'time-management'): string[] {
    return this.guidelinesData['best-practices'][area] || [];
  }

  /**
   * Get common mistakes to avoid
   */
  getCommonMistakes(): string[] {
    return this.guidelinesData.rules['common-mistakes'] || [];
  }

  /**
   * Get recommended APIs for a specific category
   */
  getRecommendedAPIs(category: string): string[] {
    return this.guidelinesData['api-integrations']?.['recommended-apis']?.[category] || [];
  }

  /**
   * Get time management guidelines
   */
  getTimeManagementGuidelines(): string[] {
    return this.getBestPractices('time-management');
  }

  /**
   * Get judging criteria
   */
  getJudgingCriteria(): any {
    return this.guidelinesData.rules['judging-criteria'] || {};
  }

  /**
   * Format knowledge base context for AI prompts
   */
  getContextForPrompt(experienceLevel: 'beginner' | 'intermediate' | 'advanced'): string {
    const quickPicks = this.getQuickPicksForExperience(experienceLevel);
    const commonMistakes = this.getCommonMistakes();
    const bestPractices = this.getBestPractices('planning');

    return `
KNOWLEDGE BASE CONTEXT:

Recommended Tech Stack Templates for ${experienceLevel}:
${quickPicks.map(id => {
  const template = this.getTechStackTemplate(id);
  return template ? `- ${template.name}: ${template.description}` : '';
}).filter(Boolean).join('\n')}

Common Hackathon Mistakes to Avoid:
${commonMistakes.map(m => `- ${m}`).join('\n')}

Best Practices:
${bestPractices.map(p => `- ${p}`).join('\n')}

Time Constraints: Most hackathons are 24 hours. Plan for 18-22 hours of actual coding time.
    `.trim();
  }
}
