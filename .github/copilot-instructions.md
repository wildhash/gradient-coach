# GitHub Copilot Instructions for Gradient Coach

## Project Overview

Gradient Coach is an AI-powered hackathon assistant that validates 24-hour feasibility, recommends tech stacks, creates timelines, generates Cline tasks, and crafts compelling pitches. It's optimized for helping developers ship hackathon demos fast.

**Tech Stack**: TypeScript, Node.js 18+, Anthropic Claude AI (supports optional DigitalOcean GradientAI endpoint)

## Repository Structure

```
gradient-coach/
├── src/
│   ├── cli.ts              # CLI interface (interactive & command mode)
│   ├── index.ts            # Core orchestration (facade pattern)
│   ├── types.ts            # TypeScript type definitions
│   ├── validators/         # Feasibility & tech stack validators
│   ├── generators/         # Timeline, tasks, pitch, scaffold generators
│   ├── knowledge/          # JSON knowledge base files
│   └── utils/              # AI client & utilities
├── tests/                  # Jest test files
├── examples/               # Example outputs and documentation
├── scripts/                # Build scripts
└── dist/                   # Compiled output (gitignored)
```

## Development Workflow

### Setup
```bash
npm install                     # Install dependencies
export ANTHROPIC_API_KEY=...   # Set API key for testing
```

### Development
```bash
npm run dev                     # Run CLI in development mode
npm run build                   # Compile TypeScript to dist/
npm start                       # Run compiled version
npm run example                 # Run example script
```

### Testing
```bash
npm test                        # Run all tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Generate coverage report
```

**ALWAYS run tests after making changes**: `npm test`

## Coding Standards

### TypeScript
- Use strict TypeScript with proper typing (no `any` unless absolutely necessary)
- Define interfaces in `src/types.ts` for all data structures
- Use async/await for asynchronous operations
- Follow existing patterns for consistency

### Code Style
- Use 2-space indentation
- Use single quotes for strings
- Add JSDoc comments for public functions
- Keep functions focused and modular (single responsibility)
- Use descriptive variable names

### File Organization
- **Validators** (`src/validators/`): Components that assess/validate input
- **Generators** (`src/generators/`): Components that create output artifacts
- **Knowledge** (`src/knowledge/`): JSON data files for templates and best practices
- **Utils** (`src/utils/`): Shared utilities and AI client

### Architecture Patterns
- Use **Facade pattern** for orchestration (see `src/index.ts`)
- Each component should have a single responsibility
- Components communicate through well-defined TypeScript interfaces
- Sequential execution: later stages depend on earlier outputs

## Testing Requirements

### Test Files
- Create test files in `tests/` directory with `.test.ts` extension
- Use Jest testing framework
- Follow existing test patterns in `tests/feasibility-validator.test.ts`

### Test Coverage
- Write unit tests for all validators and generators
- Mock AI responses using patterns from `tests/mocks.ts`
- Test both success and error cases
- Aim for high coverage (see `jest.config.js` for exclusions)

### Testing Guidelines
```typescript
// Mock AI client responses
import { createMockAIClient } from './mocks';

// Test structure
describe('ComponentName', () => {
  it('should handle valid input', async () => {
    // Arrange, Act, Assert
  });
  
  it('should handle edge cases', async () => {
    // Test edge cases
  });
});
```

## AI Integration Guidelines

### Using the AI Client
- All AI calls go through `GradientAIClient` in `src/utils/ai-client.ts`
- Use `getCompletion()` for text responses
- Use `getStructuredCompletion<T>()` for JSON responses
- AI client handles JSON extraction from markdown code blocks

### Prompt Engineering
- Be specific and structured in prompts
- Request JSON responses with explicit schemas
- Consider experience level in recommendations
- Optimize for 24-hour hackathon context
- Focus on speed over perfection

## Common Tasks

### Adding a New Component

1. **Create the file** in appropriate directory (`validators/` or `generators/`)
2. **Define types** in `src/types.ts` if needed
3. **Implement using AI client** with structured prompts
4. **Add to orchestration** in `src/index.ts`
5. **Write tests** in `tests/` directory
6. **Update documentation** if it changes user-facing behavior

### Modifying Knowledge Base

- Edit JSON files in `src/knowledge/`
- Ensure JSON is valid (test with `npm run build`)
- Add new templates following existing structure
- Update tests if knowledge base structure changes

### Updating CLI

- Modify `src/cli.ts` for interface changes
- Use `commander` for argument parsing
- Use `inquirer` for interactive prompts
- Maintain both interactive and command-line modes
- Add validation for user inputs

## Best Practices

### Performance
- Components execute sequentially (dependencies between stages)
- Single AI call per component (minimize API calls)
- Use structured prompts to reduce back-and-forth

### Error Handling
- Validate user input at CLI level
- Handle API errors gracefully with helpful messages
- Provide clear error messages for debugging
- Don't expose internal errors to users

### Security
- Never log or expose API keys
- Use environment variables for sensitive data (`ANTHROPIC_API_KEY`)
- Validate file paths to prevent directory traversal
- No user input injection into system prompts

### Output Generation
- Create output directories as needed
- Don't overwrite existing files without confirmation
- Generate multiple formats (JSON, Markdown) for flexibility
- Validate generated file contents

## Philosophy

This tool is optimized for:
- **Speed**: Getting hackers started fast
- **Simplicity**: Minimal but effective recommendations  
- **Realism**: Honest feasibility assessments
- **Action**: Concrete tasks, not just ideas

When making changes:
- Prioritize shipping velocity over perfect solutions
- Keep the user experience simple and intuitive
- Maintain realistic time estimates (24-hour constraint)
- Generate actionable outputs that developers can immediately use

## Documentation

When making significant changes, update:
- `README.md` - User-facing features and usage
- `ARCHITECTURE.md` - Technical design and patterns
- `CONTRIBUTING.md` - Development workflow
- `TESTING.md` - Testing procedures
- This file - Copilot instructions if workflow changes

## Common Pitfalls to Avoid

1. **Don't overcomplicate**: Keep recommendations simple and actionable
2. **Don't ignore experience level**: Adjust recommendations based on user expertise
3. **Don't forget time constraints**: Everything assumes 24-hour hackathon context
4. **Don't break existing tests**: Run `npm test` before committing
5. **Don't add unnecessary dependencies**: Maintain minimal dependency footprint
6. **Don't expose API errors**: Wrap AI client errors with user-friendly messages

## Key Files Reference

- `src/index.ts` - Main orchestration logic (start here for understanding flow)
- `src/types.ts` - All TypeScript interfaces and types
- `src/utils/ai-client.ts` - AI integration (Claude API)
- `src/cli.ts` - Command-line interface
- `tests/mocks.ts` - Mock data for testing
- `scripts/build.js` - Custom build script (copies knowledge base files)

## Build Process

The build process (`npm run build`):
1. Compiles TypeScript files from `src/` to `dist/`
2. Copies knowledge base JSON files to `dist/knowledge/`
3. Makes CLI executable

**Note**: Knowledge base files must be copied manually in build script because they're not TypeScript files.

## Before Submitting Changes

- [ ] Run `npm test` - All tests must pass
- [ ] Run `npm run build` - Build must succeed
- [ ] Test CLI: `npm run dev` - Interactive mode works
- [ ] Verify output quality for representative examples
- [ ] Update relevant documentation
- [ ] Check that no sensitive data is committed
- [ ] Ensure changes align with hackathon velocity philosophy
