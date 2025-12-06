# Gradient Coach

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-18+-green)](https://nodejs.org/)

> The AI co-founder that turns your hackathon idea into a shipped repo with code, Cline tasks, and a pitch—all in 60 seconds.

Gradient Coach is an AI-powered hackathon assistant that validates your project's 24-hour feasibility, recommends an ultra-lean tech stack, creates a detailed timeline, generates Cline tasks, and crafts a compelling pitch—all optimized for shipping a demo fast.

**Powered by DigitalOcean GradientAI** 🚀

## ✨ Features

- **24-Hour Feasibility Validation**: Get realistic assessment of what you can build in a hackathon
- **Ultra-Lean Tech Stack**: Recommendations optimized for fast shipping, not over-engineering
- **Knowledge Base System**: Curated templates for common project types and MLH hackathon best practices
- **Smart Timeline**: Phase-by-phase breakdown with realistic time estimates
- **Cline Task Generation**: Ready-to-use tasks for AI coding assistants
- **Pitch Generation**: Compelling pitch that highlights your innovation
- **Repository Scaffolding**: Auto-generated starter code and configuration files
- **Comprehensive Testing**: Full test suite with 37+ tests ensuring quality

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Anthropic API key (for Claude AI via DigitalOcean GradientAI)

### Installation

```bash
# Clone the repository
git clone https://github.com/wildhash/gradient-coach.git
cd gradient-coach

# Install dependencies
npm install

# Set up your API key
export ANTHROPIC_API_KEY=your-api-key-here
```

### Usage

**Interactive Mode** (Recommended):
```bash
npm run dev
```

**Command Line Mode**:
```bash
npm run dev -- coach --idea "A real-time collaboration tool for remote teams" --experience intermediate --scaffold
```

**Options**:
- `-i, --idea <idea>`: Your project idea description
- `-e, --experience <level>`: Your experience level (beginner/intermediate/advanced)
- `-s, --scaffold`: Generate repository scaffold files
- `-o, --output <dir>`: Output directory (default: ./gradient-coach-output)

## 📦 Output Files

Gradient Coach generates several files to help you get started:

```
gradient-coach-output/
├── README.md                    # Formatted report with all recommendations
├── gradient-coach-report.json   # Complete JSON output
├── cline-tasks.json            # Tasks for AI coding assistants
└── scaffold/                   # Generated project files (if --scaffold used)
    ├── README.md
    ├── package.json
    └── ... (starter code)
```

## 💡 Example

```bash
$ npm run dev

🎯 Gradient Coach - Your AI Hackathon Co-Founder

? What's your hackathon project idea? A Chrome extension that uses AI to summarize YouTube videos
? What's your coding experience level? intermediate
? Any specific features you want? (comma-separated, optional) transcript extraction, AI summary, save to notion
? Generate repository scaffold files? Yes

🚀 Starting Gradient Coach analysis...

⚡ Validating 24-hour feasibility...
   ✅ Feasibility: Feasible
   Risk Level: medium

🛠️  Recommending ultra-lean tech stack...
   ✅ Tech stack recommended

📅 Generating project timeline...
   ✅ Timeline created (18 hours)

🤖 Generating Cline tasks...
   ✅ 12 tasks generated

🎤 Crafting pitch...
   ✅ Pitch created: "SummarTube AI"

📦 Generating repository scaffold...
   ✅ 8 files generated

✨ Gradient Coach analysis complete!

📄 Full report saved to: gradient-coach-output/gradient-coach-report.json
📄 Formatted report saved to: gradient-coach-output/README.md
📄 Cline tasks saved to: gradient-coach-output/cline-tasks.json
📦 Scaffold files saved to: gradient-coach-output/scaffold/

✨ All done! Good luck at the hackathon! 🚀
```

## 🏗️ Architecture

Gradient Coach uses a modular architecture with specialized components:

- **FeasibilityValidator**: Analyzes if a project is realistic for 24 hours
- **TechStackRecommender**: Suggests optimal technologies for fast shipping
- **TimelineGenerator**: Creates phase-by-phase project timeline
- **ClineTaskGenerator**: Breaks project into AI-executable tasks
- **PitchGenerator**: Crafts compelling hackathon pitch
- **ScaffoldGenerator**: Creates starter project structure

All components are powered by Claude AI through DigitalOcean's GradientAI API.

## 📚 Knowledge Base

Gradient Coach includes a curated knowledge base with:

- **8 Tech Stack Templates**: Pre-configured stacks for common project types
  - Full-stack web apps, frontend-only apps, APIs
  - Chrome extensions, Discord bots, mobile apps (React Native)
  - CLI tools, Python ML applications
- **MLH Hackathon Guidelines**: Best practices, time management, judging criteria
- **Common Mistakes Database**: What to avoid in hackathons
- **Recommended APIs**: Curated list of reliable APIs by category

The knowledge base enhances AI recommendations with proven patterns and helps avoid common pitfalls.

## 🛠️ Development

```bash
# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🌟 Use Cases

- **First-time Hackers**: Get guidance on realistic scope and tech choices
- **Experienced Builders**: Validate ambitious ideas and optimize for speed
- **Team Planning**: Align on timeline and task distribution
- **Solo Projects**: Break down work into manageable chunks
- **AI-Assisted Development**: Generate tasks for tools like Cline

## 🔑 API Key Setup

Gradient Coach uses the Anthropic API (Claude). You can get an API key from:
1. [Anthropic Console](https://console.anthropic.com/)
2. Or use DigitalOcean's GradientAI service

Set the API key as an environment variable:
```bash
export ANTHROPIC_API_KEY=your-api-key-here
```

For DigitalOcean GradientAI, you can also set a custom base URL:
```bash
export GRADIENT_AI_BASE_URL=https://your-gradient-endpoint
```

## 📝 License

ISC

## 🤝 Contributing

Contributions welcome! This tool is designed to help hackers ship faster.

## 🙏 Acknowledgments

- Powered by DigitalOcean GradientAI
- Built for the hackathon community
- Optimized for shipping demos, not perfection

---

**Remember**: The goal is to ship a working demo in 24 hours, not build production software. Gradient Coach helps you focus on what matters. 🚀

