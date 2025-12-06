# Testing Gradient Coach

This document explains how to test Gradient Coach functionality.

## Manual Testing

### 1. Test the CLI (Interactive Mode)

```bash
# Set your API key
export ANTHROPIC_API_KEY=your-key-here

# Run the interactive CLI
npm run dev
```

Follow the prompts to test the full workflow.

### 2. Test with Command Line Arguments

```bash
npm run dev -- coach \
  --idea "A mobile app for tracking daily water intake" \
  --experience beginner \
  --scaffold \
  --output ./test-output
```

Check the `test-output/` directory for generated files.

### 3. Test Programmatic Usage

```bash
npm run example
```

This runs the example script that demonstrates programmatic usage.

## Expected Output

When running Gradient Coach, you should see:

1. **Feasibility Validation**
   - Boolean feasibility assessment
   - Risk level (low/medium/high)
   - List of concerns
   - Recommendations

2. **Tech Stack Recommendation**
   - Frontend technologies (if applicable)
   - Backend technologies (if applicable)
   - Database options
   - Deployment platforms
   - AI tools
   - Reasoning for choices

3. **Timeline**
   - Multiple phases (setup, development, polish, deploy)
   - Hour estimates for each phase
   - Task breakdown per phase

4. **Cline Tasks**
   - 8-15 actionable tasks
   - Priority levels
   - Time estimates
   - Dependencies

5. **Pitch**
   - Project title
   - Tagline
   - Problem statement
   - Solution description
   - Tech highlights

6. **Generated Files**
   - `gradient-coach-report.json`: Complete output in JSON
   - `README.md`: Formatted markdown report
   - `cline-tasks.json`: Tasks for AI assistants
   - `scaffold/`: Project starter files (if --scaffold used)

## Testing Different Scenarios

### Beginner Level Project
```bash
npm run dev -- coach \
  --idea "A simple to-do list web app" \
  --experience beginner
```

### Advanced Level Project
```bash
npm run dev -- coach \
  --idea "A distributed system for real-time data processing" \
  --experience advanced
```

### Infeasible Project
```bash
npm run dev -- coach \
  --idea "Build a fully functional operating system with GUI" \
  --experience intermediate
```

Should return `isFeasible: false` with concerns and recommendations.

## Troubleshooting

### API Key Issues
If you get an error about the API key:
```bash
export ANTHROPIC_API_KEY=your-actual-key
echo $ANTHROPIC_API_KEY  # Verify it's set
```

### JSON Parsing Errors
The AI client automatically handles markdown-wrapped JSON responses. If you still see parsing errors, check:
1. API key is valid
2. Network connectivity
3. API rate limits

### Build Errors
```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

## Performance

Expected response times (with Claude 3.5 Sonnet):
- Feasibility validation: 3-5 seconds
- Tech stack recommendation: 3-5 seconds
- Timeline generation: 3-5 seconds
- Cline tasks: 5-8 seconds
- Pitch generation: 3-5 seconds
- Scaffold generation: 8-12 seconds

**Total time**: ~30-45 seconds for full workflow without scaffold, ~45-60 seconds with scaffold.

## Quality Checks

When testing, verify:

1. **Feasibility is realistic**: Advanced projects should have higher risk, complex features should be flagged
2. **Tech stack matches experience**: Beginners should get simpler stacks
3. **Timeline is reasonable**: Should total around 18-24 hours for feasible projects
4. **Tasks are actionable**: Each Cline task should be specific and executable
5. **Pitch is compelling**: Should clearly explain the problem and solution
6. **Scaffold compiles**: If generated, files should be valid and buildable

## Example Test Cases

### Test Case 1: Simple CRUD App
- **Input**: "A blog platform with posts and comments"
- **Expected**: Feasible, simple stack (e.g., Next.js + Supabase), 15-18 hours

### Test Case 2: AI-Heavy App
- **Input**: "An app that generates personalized recipes using AI"
- **Expected**: Feasible, includes AI tools, moderate risk, 18-20 hours

### Test Case 3: Complex System
- **Input**: "A blockchain-based decentralized exchange"
- **Expected**: High risk or infeasible, recommends scope reduction

### Test Case 4: Mobile App (Beginner)
- **Input**: "A habit tracking mobile app" (beginner level)
- **Expected**: Recommends no-code or simple tools like React Native + Expo
