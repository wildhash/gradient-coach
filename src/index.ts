import { ProjectIdea, CoachOutput } from './types';
import { GradientAIClient } from './utils/ai-client';
import { FeasibilityValidator } from './validators/feasibility';
import { TechStackRecommender } from './validators/tech-stack';
import { TimelineGenerator } from './generators/timeline';
import { ClineTaskGenerator } from './generators/cline-tasks';
import { PitchGenerator } from './generators/pitch';
import { ScaffoldGenerator } from './generators/scaffold';

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
    console.log('🚀 Starting Gradient Coach analysis...\n');

    // Step 1: Validate feasibility
    console.log('⚡ Validating 24-hour feasibility...');
    const feasibility = await this.feasibilityValidator.validate(project);
    console.log(`   ${feasibility.isFeasible ? '✅' : '❌'} Feasibility: ${feasibility.isFeasible ? 'Feasible' : 'Not Feasible'}`);
    console.log(`   Risk Level: ${feasibility.riskLevel}`);

    if (!feasibility.isFeasible) {
      console.log('\n⚠️  Project may not be feasible in 24 hours. Consider these recommendations:');
      feasibility.recommendations.forEach(rec => console.log(`   - ${rec}`));
    }

    // Step 2: Recommend tech stack
    console.log('\n🛠️  Recommending ultra-lean tech stack...');
    const techStack = await this.techStackRecommender.recommend(project);
    console.log(`   ✅ Tech stack recommended`);

    // Step 3: Generate timeline
    console.log('\n📅 Generating project timeline...');
    const timeline = await this.timelineGenerator.generate(
      project,
      techStack,
      feasibility.estimatedHours
    );
    console.log(`   ✅ Timeline created (${timeline.totalHours} hours)`);

    // Step 4: Generate Cline tasks
    console.log('\n🤖 Generating Cline tasks...');
    const clineTasks = await this.clineTaskGenerator.generate(project, techStack, timeline);
    console.log(`   ✅ ${clineTasks.length} tasks generated`);

    // Step 5: Generate pitch
    console.log('\n🎤 Crafting pitch...');
    const pitch = await this.pitchGenerator.generate(project, techStack);
    console.log(`   ✅ Pitch created: "${pitch.title}"`);

    // Step 6: Generate scaffold (optional)
    let scaffoldFiles: Record<string, string> | undefined;
    if (includeScaffold) {
      console.log('\n📦 Generating repository scaffold...');
      scaffoldFiles = await this.scaffoldGenerator.generate(project, techStack);
      console.log(`   ✅ ${Object.keys(scaffoldFiles).length} files generated`);
    }

    console.log('\n✨ Gradient Coach analysis complete!\n');

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
