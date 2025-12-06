# Quick Start Guide

Get coaching for your hackathon project in under 2 minutes!

## 1. Prerequisites

- Node.js 18 or higher
- An Anthropic API key ([Get one here](https://console.anthropic.com/))

## 2. Setup (30 seconds)

```bash
# Clone and install
git clone https://github.com/wildhash/gradient-coach.git
cd gradient-coach
npm install

# Add your API key
export ANTHROPIC_API_KEY=sk-ant-...your-key-here
```

## 3. Run Gradient Coach (30 seconds)

### Option A: Interactive Mode (Recommended)
```bash
npm run dev
```

Answer the prompts:
- What's your project idea?
- Your experience level?
- Desired features? (optional)
- Generate scaffold? (yes/no)

### Option B: Quick Command
```bash
npm run dev -- coach \
  --idea "Your project idea here" \
  --experience intermediate \
  --scaffold
```

## 4. Review Output (30 seconds)

Check the `gradient-coach-output/` folder:

```bash
cd gradient-coach-output
cat README.md  # Full formatted report
```

You'll find:
- ✅ Feasibility assessment
- 🛠️ Tech stack recommendations
- 📅 Hour-by-hour timeline
- 🤖 Ready-to-use Cline tasks
- 🎤 Hackathon pitch
- 📦 Starter code (if you chose scaffold)

## 5. Start Building! 🚀

Use the generated timeline and tasks to guide your development. Import `cline-tasks.json` into your AI coding assistant to automate development.

## Example

```bash
$ npm run dev

? What's your hackathon project idea?
> A Chrome extension that summarizes articles using AI

? What's your coding experience level?
> intermediate

? Any specific features? (comma-separated, optional)
> bookmark articles, export summaries, dark mode

? Generate repository scaffold files?
> Yes

✨ 60 seconds later...

📄 Full report saved to: gradient-coach-output/gradient-coach-report.json
📄 Formatted report saved to: gradient-coach-output/README.md
📄 Cline tasks saved to: gradient-coach-output/cline-tasks.json
📦 Scaffold files saved to: gradient-coach-output/scaffold/

✨ All done! Good luck at the hackathon! 🚀
```

## Troubleshooting

**"ANTHROPIC_API_KEY environment variable not set"**
```bash
export ANTHROPIC_API_KEY=your-key-here
```

**"npm: command not found"**
- Install Node.js from [nodejs.org](https://nodejs.org/)

**Build errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

## What's Next?

1. Read the generated `README.md` in the output folder
2. Review feasibility concerns and adjust scope if needed
3. Set up your project using the recommended tech stack
4. Follow the timeline to stay on track
5. Use Cline tasks with AI coding assistants
6. Practice your pitch!

---

Need help? Check [TESTING.md](TESTING.md) for detailed testing instructions or [README.md](README.md) for full documentation.
