import { ProjectIdea, CoachOutput } from './types';
import { GradientAIClient } from './utils/ai-client';
import { FeasibilityValidator } from './validators/feasibility';
import { TechStackRecommender } from './validators/tech-stack';
import { TimelineGenerator } from './generators/timeline';
import { ClineTaskGenerator } from './generators/cline-tasks';
import { PitchGenerator } from './generators/pitch';
import { ScaffoldGenerator } from './generators/scaffold';
import { logger } from './utils/logger';

export class GradientCoach {
  private ai: GradientAIClient;
  private feasibilityValidator: FeasibilityValidator;
  private techStackRecommender: TechStackRecommender;
  private timelineGenerator: TimelineGenerator;
  private clineTaskGenerator: ClineTaskGenerator;
  private pitchGenerator: PitchGenerator;
  private scaffoldGenerator: ScaffoldGenerator;

  constructor(apiKey?: string) {
    this.ai = new GradientAIClient(apiKey);
    this.feasibilityValidator = new FeasibilityValidator(this.ai);
    this.techStackRecommender = new TechStackRecommender(this.ai);
    this.timelineGenerator = new TimelineGenerator(this.ai);
    this.clineTaskGenerator = new ClineTaskGenerator(this.ai);
    this.pitchGenerator = new PitchGenerator(this.ai);
    this.scaffoldGenerator = new ScaffoldGenerator(this.ai);
  }

  async coach(project: ProjectIdea, includeScaffold: boolean = false): Promise<CoachOutput> {
    logger.section('🚀 Starting Gradient Coach analysis...');

    // Step 1: Validate feasibility
    logger.step('⚡ Validating 24-hour feasibility...');
    const feasibility = await this.feasibilityValidator.validate(project);
    logger.result('Feasibility', feasibility.isFeasible ? '✅ Feasible' : '❌ Not Feasible');
    logger.result('Risk Level', feasibility.riskLevel);

    if (!feasibility.isFeasible) {
      logger.warning('Project may not be feasible in 24 hours. Consider these recommendations:');
      feasibility.recommendations.forEach(rec => logger.info(`   - ${rec}`));
    }

    // Step 2: Recommend tech stack
    logger.step('🛠️  Recommending ultra-lean tech stack...');
    const techStack = await this.techStackRecommender.recommend(project);
    logger.success('Tech stack recommended');

    // Step 3: Generate timeline
    logger.step('📅 Generating project timeline...');
    const timeline = await this.timelineGenerator.generate(
      project,
      techStack,
      feasibility.estimatedHours
    );
    logger.success(`Timeline created (${timeline.totalHours} hours)`);

    // Step 4: Generate Cline tasks
    logger.step('🤖 Generating Cline tasks...');
    const clineTasks = await this.clineTaskGenerator.generate(project, techStack, timeline);
    logger.success(`${clineTasks.length} tasks generated`);

    // Step 5: Generate pitch
    logger.step('🎤 Crafting pitch...');
    const pitch = await this.pitchGenerator.generate(project, techStack);
    logger.success(`Pitch created: "${pitch.title}"`);

    // Step 6: Generate scaffold (optional)
    let scaffoldFiles: Record<string, string> | undefined;
    if (includeScaffold) {
      logger.step('📦 Generating repository scaffold...');
      scaffoldFiles = await this.scaffoldGenerator.generate(project, techStack);
      logger.success(`${Object.keys(scaffoldFiles).length} files generated`);
    }

    logger.section('✨ Gradient Coach analysis complete!');

    return {
      feasibility,
      techStack,
      timeline,
      clineTasks,
      pitch,
      scaffoldFiles,
    };
  }
}
