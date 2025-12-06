import * as fs from 'fs';
import * as path from 'path';

/**
 * Knowledge Base Loader
 * Provides access to curated templates, guidelines, and best practices
 */
export class KnowledgeBase {
  private techStacksData: any;
  private guidelinesData: any;

  constructor() {
    this.loadKnowledgeBase();
  }

  private loadKnowledgeBase(): void {
    try {
      const techStacksPath = path.join(__dirname, '../knowledge/tech-stacks.json');
      const guidelinesPath = path.join(__dirname, '../knowledge/mlh-guidelines.json');

      this.techStacksData = JSON.parse(fs.readFileSync(techStacksPath, 'utf-8'));
      this.guidelinesData = JSON.parse(fs.readFileSync(guidelinesPath, 'utf-8'));
    } catch (error) {
      console.warn('Warning: Could not load knowledge base files. Using defaults.');
      this.techStacksData = { 
        templates: {}, 
        quickPicks: { beginner: [], intermediate: [], advanced: [] }, 
        recommendations: {} 
      };
      this.guidelinesData = { 
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
  }

  /**
   * Get a tech stack template by ID
   */
  getTechStackTemplate(templateId: string): any | null {
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
        return templateId as string;
      }
    }
    return null;
  }

  /**
   * Get all tech stack templates
   */
  getAllTechStackTemplates(): any {
    return this.techStacksData.templates;
  }

  /**
   * Get MLH hackathon guidelines
   */
  getHackathonGuidelines(): any {
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
