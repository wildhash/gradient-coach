import { GradientCoach } from './index';

/**
 * Example usage of Gradient Coach
 * 
 * This demonstrates how to use Gradient Coach programmatically
 * to analyze a hackathon project idea.
 */
async function main() {
  // Make sure ANTHROPIC_API_KEY is set in your environment
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable not set');
    process.exit(1);
  }

  // Create a new Gradient Coach instance
  const coach = new GradientCoach();

  // Define your project idea
  const projectIdea = {
    idea: 'A web app that uses AI to generate personalized workout plans based on user goals and fitness level',
    experienceLevel: 'intermediate' as const,
    features: ['AI workout generation', 'Progress tracking', 'Video tutorials'],
  };

  console.log('Example: Coaching a hackathon project\n');
  console.log(`Idea: ${projectIdea.idea}`);
  console.log(`Experience: ${projectIdea.experienceLevel}\n`);

  try {
    // Run the full coaching process
    const output = await coach.coach(projectIdea, false);

    console.log('\n=== Results ===\n');
    console.log(`Pitch: ${output.pitch.title}`);
    console.log(`Tagline: ${output.pitch.tagline}`);
    console.log(`Feasible: ${output.feasibility.isFeasible}`);
    console.log(`Risk: ${output.feasibility.riskLevel}`);
    console.log(`Tasks generated: ${output.clineTasks.length}`);
    console.log(`Timeline phases: ${output.timeline.phases.length}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { main };
