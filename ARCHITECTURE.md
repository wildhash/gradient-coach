# Architecture Overview

This document provides a technical overview of Gradient Coach's architecture and design decisions.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLI Interface                        │
│                    (src/cli.ts)                             │
│  Interactive Mode / Command Line Mode                       │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    Gradient Coach Core                       │
│                     (src/index.ts)                          │
│  Orchestrates all components and manages workflow          │
└────┬────────────────────────────────────────────────────────┘
     │
     ├──────────┬──────────┬──────────┬──────────┬──────────┐
     ▼          ▼          ▼          ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│Feasibil-│ │Tech    │ │Timeline │ │Cline   │ │Pitch   │ │Scaffold│
│ity      │ │Stack   │ │Generator│ │Tasks   │ │Gener-  │ │Gener-  │
│Validator│ │Recom-  │ │         │ │Gener-  │ │ator    │ │ator    │
│         │ │mender  │ │         │ │ator    │ │        │ │        │
└────┬────┘ └───┬────┘ └────┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
     │          │           │           │          │          │
     └──────────┴───────────┴───────────┴──────────┴──────────┘
                            │
                            ▼
                  ┌─────────────────┐
                  │  GradientAI     │
                  │  Client         │
                  │  (Anthropic API)│
                  └─────────────────┘
```

## Component Breakdown

### 1. CLI Interface (`src/cli.ts`)
**Responsibility**: User interaction and output formatting

- **Interactive Mode**: Prompts users for input using `inquirer`
- **Command Mode**: Accepts flags for automated usage
- **Output Management**: Saves JSON reports, formatted markdown, and scaffold files
- **Error Handling**: User-friendly error messages and validation

**Key Features**:
- Environment variable validation (API key check)
- Multiple output formats (JSON, Markdown)
- Directory management for generated files
- Progress indicators and success messages

### 2. Gradient Coach Core (`src/index.ts`)
**Responsibility**: Workflow orchestration

Executes the coaching process in order:
1. Validate feasibility
2. Recommend tech stack
3. Generate timeline
4. Generate Cline tasks
5. Create pitch
6. Generate scaffold (optional)

**Design Pattern**: Facade pattern - provides simple interface to complex subsystem

### 3. Validators

#### Feasibility Validator (`src/validators/feasibility.ts`)
**Responsibility**: Assess 24-hour feasibility

**Inputs**:
- Project idea description
- Experience level
- Desired features
- Constraints

**Outputs**:
- Boolean feasibility
- Risk level (low/medium/high)
- Specific concerns
- Recommendations
- Time estimate

**AI Prompt Strategy**: Asks Claude to consider time constraints, experience level, and common hackathon pitfalls

#### Tech Stack Recommender (`src/validators/tech-stack.ts`)
**Responsibility**: Suggest optimal technologies

**Strategy**:
- Prioritizes speed over perfection
- Considers experience level
- Focuses on well-documented tools
- Minimizes setup time
- Suggests specific versions/tools

**Categories**:
- Frontend (if applicable)
- Backend (if applicable)
- Database (if applicable)
- Deployment (always)
- AI Tools (if applicable)

### 4. Generators

#### Timeline Generator (`src/generators/timeline.ts`)
**Responsibility**: Create hour-by-hour plan

**Output Structure**:
- Multiple phases (typically 4-6)
- Each phase has:
  - Name
  - Description
  - Hour allocation
  - Specific tasks

**Default Phases**:
1. Setup & Infrastructure
2. Core Feature Development
3. UI/UX Polish
4. Testing & Deployment
5. Buffer Time

#### Cline Task Generator (`src/generators/cline-tasks.ts`)
**Responsibility**: Break project into AI-executable tasks

**Task Properties**:
- Unique ID
- Clear title
- Detailed description
- Priority level
- Time estimate (minutes)
- Dependencies (optional)

**Task Types**:
- Setup tasks (high priority, no dependencies)
- Feature tasks (high/medium priority)
- Polish tasks (medium/low priority)
- Deployment tasks (high priority, late dependencies)

#### Pitch Generator (`src/generators/pitch.ts`)
**Responsibility**: Create hackathon pitch

**Components**:
- Project title (catchy, 2-4 words)
- Tagline (one sentence)
- Problem statement
- Solution description
- Tech highlights (3-5 points)

**Strategy**: Emphasizes innovation, impact, and technical achievement

#### Scaffold Generator (`src/generators/scaffold.ts`)
**Responsibility**: Generate starter code

**Generates**:
- Configuration files (package.json, tsconfig.json, etc.)
- README with setup instructions
- Basic project structure
- Environment variable templates
- Starter code for main components

**Approach**: Minimal but functional - enough to get started quickly

### 5. AI Client (`src/utils/ai-client.ts`)
**Responsibility**: Communication with Anthropic API

**Features**:
- Generic completion method
- Specialized JSON parsing method
- Markdown code block extraction
- Error handling and retries
- Configurable base URL (for DigitalOcean GradientAI)

**JSON Handling**:
1. Sends structured prompt requesting JSON
2. Receives response (may include markdown formatting)
3. Extracts JSON from code blocks if present
4. Parses and validates
5. Returns typed object

### 6. Type System (`src/types.ts`)
**Responsibility**: Type safety and contracts

**Key Interfaces**:
- `ProjectIdea`: User input structure
- `FeasibilityResult`: Feasibility assessment output
- `TechStack`: Technology recommendations
- `Timeline`: Project timeline structure
- `ClineTask`: Individual task definition
- `Pitch`: Pitch components
- `CoachOutput`: Complete system output

## Data Flow

```
User Input
    ↓
ProjectIdea Object
    ↓
Feasibility Validator → FeasibilityResult
    ↓                        ↓
Tech Stack Recommender → TechStack
    ↓                        ↓
Timeline Generator → Timeline
    ↓                        ↓
Cline Task Generator → ClineTask[]
    ↓                        ↓
Pitch Generator → Pitch
    ↓                        ↓
(Optional) Scaffold Generator → Files
    ↓
CoachOutput Object
    ↓
File System (JSON, Markdown, Scaffold files)
```

## Design Decisions

### 1. TypeScript
**Why**: Type safety, better IDE support, catches errors at compile time

### 2. Modular Architecture
**Why**: Each component has single responsibility, easy to test and maintain

### 3. AI-First Approach
**Why**: Leverages Claude's reasoning for complex decisions (feasibility, tech choices)

### 4. JSON Structured Output
**Why**: Consistent, parseable, can be used programmatically

### 5. CLI + Programmatic API
**Why**: Supports both interactive users and automated workflows

### 6. Minimal Dependencies
**Why**: Faster installation, fewer security vulnerabilities, easier maintenance

## Performance Considerations

### Sequential Execution
Components execute sequentially because later stages depend on earlier outputs:
- Timeline needs feasibility estimate
- Tasks need timeline and tech stack
- Scaffold needs tech stack

**Future Optimization**: Some components (pitch, scaffold) could run in parallel

### AI Call Optimization
- Single API call per component
- Structured prompts minimize back-and-forth
- JSON responses reduce parsing complexity

### Caching Strategy
Currently: None (each run is fresh)
**Future**: Cache tech stack recommendations for similar projects

## Error Handling

### Levels
1. **User Input Validation**: CLI checks before processing
2. **API Errors**: Graceful degradation with helpful messages
3. **JSON Parsing**: Falls back to raw response, shows parsing error
4. **File System**: Creates directories as needed, handles permission errors

### Recovery Strategy
- API failures: Show error, exit gracefully
- Parsing failures: Show raw response for debugging
- File system failures: Clear error message about permissions/disk space

## Security Considerations

### API Key Management
- Environment variables only
- Never logged or included in output
- Clear error if missing

### File Generation
- Validates output paths
- Creates files in user-specified directory only
- Doesn't overwrite existing files without confirmation

### AI Prompts
- No user input injection into system prompts
- Structured prompts prevent prompt injection
- JSON parsing prevents code execution

## Testing Strategy

### Unit Tests (Future)
- Individual component testing
- Mock AI responses
- Validate output structures

### Integration Tests (Current)
- Manual CLI testing
- Example script (`src/example.ts`)
- Build verification

### E2E Tests (Future)
- Full workflow with real API
- Multiple project types
- Edge cases (infeasible projects, complex requirements)

## Extensibility Points

### Adding New Components
1. Create in appropriate directory (`validators/`, `generators/`)
2. Implement using AI client
3. Add to orchestration in `src/index.ts`
4. Update types in `src/types.ts`

### Custom AI Models
- Modify `GradientAIClient` to support different providers
- Keep interface same for component compatibility

### Output Formats
- Add new formatters in `src/cli.ts`
- Support PDF, slides, etc.

### Template System
- `src/templates/` directory ready for predefined scaffolds
- Could add project templates for common patterns

## Dependencies

### Production
- `@anthropic-ai/sdk`: AI model access
- `commander`: CLI argument parsing
- `inquirer`: Interactive prompts
- `chalk`: Terminal colors (currently unused, ready for UI enhancement)

### Development
- `typescript`: Type checking and compilation
- `tsx`: Fast TypeScript execution
- `@types/*`: Type definitions

## Future Enhancements

1. **Template Library**: Pre-built scaffolds for common hackathon types
2. **Team Mode**: Multi-developer task allocation
3. **Progress Tracking**: Integration with project management tools
4. **Export Formats**: PDF reports, slide decks
5. **Custom Models**: Support for other AI providers
6. **Caching**: Smart caching for similar projects
7. **Analytics**: Track success rates, common patterns
8. **Web Interface**: Browser-based alternative to CLI

---

*This architecture is optimized for hackathon velocity while maintaining code quality and extensibility.*
