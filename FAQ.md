# Frequently Asked Questions (FAQ)

## General Questions

### What is Gradient Coach?
Gradient Coach is an AI-powered assistant that helps you validate and plan hackathon projects. It analyzes your idea, recommends technologies, creates a timeline, generates tasks, and crafts a pitch—all optimized for shipping a demo in 24 hours.

### Who is this for?
- First-time hackathon participants who need guidance
- Experienced developers who want to validate ambitious ideas
- Teams looking to align on scope and timeline
- Anyone using AI coding assistants like Cline

### How much does it cost?
Gradient Coach itself is free and open source. However, it requires an Anthropic API key which has usage costs. Typical usage costs $0.10-0.30 per project analysis.

### What's the difference between this and ChatGPT?
Gradient Coach is specifically designed for hackathons with:
- Structured output (JSON, tasks, timeline)
- 24-hour feasibility focus
- Tech stack optimization for speed
- Ready-to-use Cline tasks
- Repository scaffolding

## Setup Questions

### What API key do I need?
You need an Anthropic API key. Get one at: https://console.anthropic.com/

If you're using DigitalOcean GradientAI, you can use their endpoint by setting `GRADIENT_AI_BASE_URL`.

### How do I set up the API key?
```bash
export ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Add it to your `.bashrc`, `.zshrc`, or `.env` file to make it permanent.

### Do I need to install anything else?
Just Node.js 18 or higher. All other dependencies are installed via `npm install`.

### Can I use this with DigitalOcean GradientAI?
Yes! Set the base URL:
```bash
export GRADIENT_AI_BASE_URL=https://your-gradient-endpoint
```

## Usage Questions

### How long does it take to run?
Typically 30-60 seconds for a full analysis:
- Without scaffold: ~30-45 seconds
- With scaffold: ~45-60 seconds

### What if my project is too ambitious?
Gradient Coach will mark it as not feasible and provide recommendations to scope it down to something achievable in 24 hours.

### Can I regenerate just one part?
Currently, no. You need to run the full analysis. However, you can modify the output JSON files manually.

### Can I use this for projects longer than 24 hours?
Yes, but it's optimized for hackathon timeframes. The feasibility assessments and timelines assume a 24-hour constraint.

### What if I disagree with the recommendations?
The recommendations are AI-generated and may not be perfect. Use your judgment! The tool is meant to guide, not dictate.

## Output Questions

### What files are generated?
- `gradient-coach-report.json`: Complete JSON output
- `README.md`: Formatted markdown report
- `cline-tasks.json`: Tasks for AI assistants
- `scaffold/`: Project files (if `--scaffold` flag used)

### Can I customize the output directory?
Yes! Use the `-o` or `--output` flag:
```bash
npm run dev -- coach -o ./my-custom-directory
```

### What format are the Cline tasks?
JSON array with this structure:
```json
{
  "id": "task-1",
  "title": "Task name",
  "description": "Detailed description",
  "priority": "high|medium|low",
  "estimatedMinutes": 30,
  "dependencies": ["task-0"]
}
```

### Can I export to PDF or slides?
Not yet, but it's on the roadmap! You can convert the markdown output using tools like Pandoc.

## Technical Questions

### What AI model does it use?
Claude 3.5 Sonnet from Anthropic, which excels at reasoning and structured output.

### Does it store my data?
No. All processing happens locally and via direct API calls. Nothing is stored on servers (except standard API logs at Anthropic).

### Can I run this offline?
No, it requires an internet connection to access the Anthropic API.

### What programming languages/frameworks does it support?
It supports any technology stack. The AI recommends based on your project needs and experience level.

### Is the generated code production-ready?
No. Gradient Coach optimizes for hackathon demos, not production systems. The scaffolds are starting points, not final products.

## Troubleshooting

### "ANTHROPIC_API_KEY environment variable not set"
Solution:
```bash
export ANTHROPIC_API_KEY=your-key-here
echo $ANTHROPIC_API_KEY  # Verify it's set
```

### "Failed to parse JSON response"
This usually means the AI returned unexpected formatting. The error message will show the raw response. Try running again, or file an issue with the error details.

### "API call failed"
Check:
1. Your API key is valid
2. You have API credits
3. Your internet connection is working
4. The API endpoint is accessible

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### The scaffold generation failed
Scaffold generation is complex and may timeout. Try running without `--scaffold` first, then use the tech stack recommendations to set up your project manually.

## Best Practices

### How should I describe my project idea?
Be specific but concise:
- ✅ "A Chrome extension that summarizes YouTube videos using AI and saves to Notion"
- ❌ "An app"
- ❌ "A revolutionary platform that will change the world..."

### What experience level should I choose?
- **Beginner**: Limited coding experience, need simple tools
- **Intermediate**: Comfortable with at least one language/framework
- **Advanced**: Experienced developer, can handle complex stacks

### Should I use the scaffold feature?
Use it if:
- You're a beginner and want a starting point
- You're unfamiliar with the recommended tech stack
- You want to save 30-60 minutes of setup time

Skip it if:
- You're experienced with the tech stack
- You have your own project template
- You want more control over the initial setup

### How do I use the Cline tasks?
1. Open the `cline-tasks.json` file
2. Review the tasks and their order
3. Feed them to Cline or another AI coding assistant
4. Use as a checklist to track progress

## Contributing

### Can I contribute?
Yes! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### What features are planned?
See [ARCHITECTURE.md](ARCHITECTURE.md) for the roadmap. Key future features:
- Template library
- Team mode
- PDF export
- Progress tracking integration
- Web interface

### How do I report bugs?
Open an issue on GitHub with:
- What you were trying to do
- What happened
- Error messages (if any)
- Your environment (OS, Node version)

## Hackathon-Specific

### When should I run Gradient Coach?
Ideally, before the hackathon starts or in the first hour. This gives you a clear plan from the beginning.

### Should I follow the timeline exactly?
Use it as a guide, not gospel. Adjust based on your actual progress and team dynamics.

### What if I'm working in a team?
Run Gradient Coach together and discuss the recommendations. Use the Cline tasks to divide work among team members.

### How do I present the output to judges?
Use the generated pitch as your starting point. The tech highlights are great for technical questions from judges.

### Can this help me win?
It helps you scope realistically and ship a working demo, which is half the battle. The other half is execution, creativity, and presentation!

## Comparisons

### Gradient Coach vs. Manual Planning?
**Gradient Coach**: 60 seconds, AI-validated, structured output
**Manual**: Hours, prone to scope creep, may miss feasibility issues

### Gradient Coach vs. Project Templates?
**Templates**: Good for common patterns
**Gradient Coach**: Customized to your specific idea

Both can complement each other—use Gradient Coach for planning, templates for implementation.

### Gradient Coach vs. Hackathon Mentors?
Gradient Coach provides instant feedback, but human mentors offer:
- Domain expertise
- Networking opportunities
- Emotional support
- Real-time problem solving

Use both!

---

Have more questions? Open an issue or discussion on GitHub!
