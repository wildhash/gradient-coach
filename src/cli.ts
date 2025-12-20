#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import { GradientCoach } from './index';
import { ProjectIdea } from './types';
import * as fs from 'fs';
import * as path from 'path';
import { formatErrorForUser } from './utils/errors';
import { validateExperienceLevel, validateProjectIdea, validateAPIKey, validateOutputDirectory, validateFeatures } from './utils/validation';
import { logger } from './utils/logger';

const program = new Command();

program
  .name('gradient-coach')
  .description('AI hackathon co-founder powered by DigitalOcean GradientAI')
  .version('1.0.0');

program
  .command('coach')
  .description('Get AI coaching for your hackathon project')
  .option('-i, --idea <idea>', 'Project idea description')
  .option('-e, --experience <level>', 'Experience level (beginner/intermediate/advanced)')
  .option('-s, --scaffold', 'Generate repository scaffold files')
  .option('-o, --output <dir>', 'Output directory for generated files', './gradient-coach-output')
  .action(async (options) => {
    try {
      // Check for API key
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        logger.error('ANTHROPIC_API_KEY environment variable not set');
        logger.info('\nPlease set your API key:');
        console.log('  export ANTHROPIC_API_KEY=your-api-key-here\n');
        process.exit(1);
      }

      // Validate API key format
      try {
        validateAPIKey(apiKey);
      } catch (error) {
        logger.error((error as Error).message);
        logger.info('\nGet your API key from: https://console.anthropic.com/\n');
        process.exit(1);
      }

      // Validate output directory
      try {
        validateOutputDirectory(options.output);
      } catch (error) {
        logger.error((error as Error).message);
        process.exit(1);
      }

      let projectIdea: ProjectIdea;

      // Interactive mode if no options provided
      if (!options.idea || !options.experience) {
        console.log('🎯 Gradient Coach - Your AI Hackathon Co-Founder\n');
        
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'idea',
            message: 'What\'s your hackathon project idea?',
            default: options.idea,
            validate: (input) => {
              try {
                validateProjectIdea(input);
                return true;
              } catch (error) {
                return (error as Error).message;
              }
            },
          },
          {
            type: 'list',
            name: 'experienceLevel',
            message: 'What\'s your coding experience level?',
            choices: ['beginner', 'intermediate', 'advanced'],
            default: options.experience || 'intermediate',
          },
          {
            type: 'input',
            name: 'features',
            message: 'Any specific features you want? (comma-separated, optional)',
          },
          {
            type: 'confirm',
            name: 'scaffold',
            message: 'Generate repository scaffold files?',
            default: options.scaffold || false,
          },
        ]);

        const features = answers.features 
          ? answers.features.split(',').map((f: string) => f.trim()).filter(Boolean) 
          : undefined;

        // Validate features
        if (features) {
          try {
            validateFeatures(features);
          } catch (error) {
            logger.error((error as Error).message);
            process.exit(1);
          }
        }

        projectIdea = {
          idea: answers.idea,
          experienceLevel: answers.experienceLevel as 'beginner' | 'intermediate' | 'advanced',
          features,
        };
        options.scaffold = answers.scaffold;
      } else {
        // Validate command-line inputs
        try {
          validateProjectIdea(options.idea);
          const experienceLevel = validateExperienceLevel(options.experience);
          
          projectIdea = {
            idea: options.idea,
            experienceLevel,
          };
        } catch (error) {
          logger.error((error as Error).message);
          process.exit(1);
        }
      }

      // Run the coach
      const coach = new GradientCoach();
      const output = await coach.coach(projectIdea, options.scaffold);

      // Save output to files
      const outputDir = options.output;
      try {
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Save main output
        const outputPath = path.join(outputDir, 'gradient-coach-report.json');
        fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
        logger.info(`Full report saved to: ${outputPath}`);

        // Save README with formatted output
        const readmePath = path.join(outputDir, 'README.md');
        const readme = generateReadme(output, projectIdea);
        fs.writeFileSync(readmePath, readme);
        logger.info(`Formatted report saved to: ${readmePath}`);

        // Save Cline tasks
        const tasksPath = path.join(outputDir, 'cline-tasks.json');
        fs.writeFileSync(tasksPath, JSON.stringify(output.clineTasks, null, 2));
        logger.info(`Cline tasks saved to: ${tasksPath}`);

        // Save scaffold files if generated
        if (output.scaffoldFiles) {
          const scaffoldDir = path.join(outputDir, 'scaffold');
          if (!fs.existsSync(scaffoldDir)) {
            fs.mkdirSync(scaffoldDir, { recursive: true });
          }

          for (const [filename, content] of Object.entries(output.scaffoldFiles)) {
            const filePath = path.join(scaffoldDir, filename);
            const fileDir = path.dirname(filePath);
            if (!fs.existsSync(fileDir)) {
              fs.mkdirSync(fileDir, { recursive: true });
            }
            fs.writeFileSync(filePath, content);
          }
          logger.info(`Scaffold files saved to: ${scaffoldDir}/`);
        }
      } catch (error) {
        logger.error(`Failed to save output files: ${(error as Error).message}`);
        process.exit(1);
      }

      logger.success('\nAll done! Good luck at the hackathon! 🚀\n');
      process.exit(0);

    } catch (error) {
      console.error('\n' + formatErrorForUser(error as Error));
      logger.debug((error as Error).stack || '');
      process.exit(1);
    }
  });

program
  .command('interactive')
  .description('Interactive mode for project coaching')
  .action(async () => {
    program.parse(['', '', 'coach']);
  });

function generateReadme(output: any, project: ProjectIdea): string {
  return `# ${output.pitch.title}

> ${output.pitch.tagline}

## 🎯 The Pitch

### Problem
${output.pitch.problem}

### Solution
${output.pitch.solution}

### Tech Highlights
${output.pitch.techHighlights.map((h: string) => `- ${h}`).join('\n')}

## 📊 Feasibility Assessment

- **Feasible in 24 hours:** ${output.feasibility.isFeasible ? '✅ Yes' : '❌ No'}
- **Risk Level:** ${output.feasibility.riskLevel}
- **Estimated Hours:** ${output.feasibility.estimatedHours}

${output.feasibility.concerns.length > 0 ? `### ⚠️ Concerns
${output.feasibility.concerns.map((c: string) => `- ${c}`).join('\n')}
` : ''}

${output.feasibility.recommendations.length > 0 ? `### 💡 Recommendations
${output.feasibility.recommendations.map((r: string) => `- ${r}`).join('\n')}
` : ''}

## 🛠️ Tech Stack

${output.techStack.frontend ? `### Frontend
${output.techStack.frontend.map((t: string) => `- ${t}`).join('\n')}
` : ''}

${output.techStack.backend ? `### Backend
${output.techStack.backend.map((t: string) => `- ${t}`).join('\n')}
` : ''}

${output.techStack.database ? `### Database
${output.techStack.database.map((t: string) => `- ${t}`).join('\n')}
` : ''}

${output.techStack.deployment ? `### Deployment
${output.techStack.deployment.map((t: string) => `- ${t}`).join('\n')}
` : ''}

${output.techStack.aiTools ? `### AI Tools
${output.techStack.aiTools.map((t: string) => `- ${t}`).join('\n')}
` : ''}

### Reasoning
${output.techStack.reasoning}

## 📅 Timeline (${output.timeline.totalHours} hours)

${output.timeline.phases.map((phase: any) => `### ${phase.name} (${phase.hours}h)
${phase.description}

**Tasks:**
${phase.tasks.map((task: string) => `- ${task}`).join('\n')}
`).join('\n')}

## 🤖 Cline Tasks

${output.clineTasks.map((task: any, i: number) => `### ${i + 1}. ${task.title} (${task.estimatedMinutes}min)
**Priority:** ${task.priority}
${task.dependencies ? `**Dependencies:** ${task.dependencies.join(', ')}\n` : ''}
${task.description}
`).join('\n')}

---

*Generated by Gradient Coach - Your AI Hackathon Co-Founder*
*Powered by DigitalOcean GradientAI*
`;
}

program.parse();
