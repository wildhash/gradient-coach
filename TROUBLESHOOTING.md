# Troubleshooting Guide

This guide helps you resolve common issues when using Gradient Coach.

## Common Errors

### API Key Issues

#### Error: "ANTHROPIC_API_KEY environment variable not set"

**Cause**: The required API key is not configured in your environment.

**Solution**:
```bash
export ANTHROPIC_API_KEY=your-api-key-here
```

For permanent setup, add to your shell profile (`~/.bashrc`, `~/.zshrc`, etc.):
```bash
echo 'export ANTHROPIC_API_KEY=your-api-key-here' >> ~/.bashrc
source ~/.bashrc
```

#### Error: "API key appears to be invalid"

**Cause**: The API key format is incorrect or the key is malformed.

**Solution**:
- Verify your API key starts with `sk-ant-`
- Check for extra spaces or line breaks
- Get a new key from [Anthropic Console](https://console.anthropic.com/)

#### Error: "Invalid API key. Please check your ANTHROPIC_API_KEY"

**Cause**: The API key is correctly formatted but not valid (expired, revoked, or incorrect).

**Solution**:
1. Verify your key at [Anthropic Console](https://console.anthropic.com/)
2. Generate a new API key if needed
3. Update your environment variable

### Connection Issues

#### Error: "AI service temporarily unavailable"

**Cause**: Network issues or the Anthropic API service is down.

**Solution**:
- Check your internet connection
- Wait a few minutes and try again
- Check [Anthropic Status](https://status.anthropic.com/) for service status
- The tool automatically retries with exponential backoff

#### Error: "Rate limit exceeded"

**Cause**: Too many requests sent to the API in a short time.

**Solution**:
- Wait 1-2 minutes before retrying
- If using in automation, add delays between runs
- Consider upgrading your API plan for higher limits

### Validation Errors

#### Error: "Project idea is too short"

**Cause**: Your project description is less than 10 characters.

**Solution**:
Provide a more detailed description (at least 10 characters):
```bash
npm run dev -- coach --idea "Build a Chrome extension for AI-powered YouTube summaries" --experience intermediate
```

#### Error: "Invalid experience level"

**Cause**: Experience level must be exactly: beginner, intermediate, or advanced.

**Solution**:
Use one of the valid experience levels:
```bash
npm run dev -- coach --idea "Your project" --experience intermediate
```

#### Error: "Too many features specified"

**Cause**: You specified more than 20 features (unrealistic for 24-hour hackathon).

**Solution**:
Reduce to 20 or fewer features to keep scope realistic.

### File System Errors

#### Error: "Cannot write to output directory"

**Cause**: Permission issues or invalid path.

**Solution**:
1. Check directory permissions:
   ```bash
   ls -la ./gradient-coach-output
   ```
2. Create directory manually:
   ```bash
   mkdir -p ./gradient-coach-output
   ```
3. Use absolute path:
   ```bash
   npm run dev -- coach --output /full/path/to/output
   ```

#### Error: "Invalid output directory path"

**Cause**: Path contains dangerous elements (`..`, `/etc`, `/sys`).

**Solution**:
Use a safe, relative path in your project directory:
```bash
npm run dev -- coach --output ./my-project-output
```

### Generation Errors

#### Error: "Failed to parse AI response"

**Cause**: The AI service returned an unexpected format.

**Solution**:
1. Enable debug mode for more details:
   ```bash
   DEBUG=true npm run dev
   ```
2. Try again - this is usually transient
3. If persistent, report the issue with debug logs

#### Error: "Output validation failed"

**Cause**: Generated output is incomplete or malformed.

**Solution**:
1. Try generating again - AI responses can vary
2. Check your project idea is clear and well-defined
3. If persistent, simplify your project idea
4. Report the issue with your input if problem continues

## Tips for Best Results

### Writing Good Project Ideas

**Good examples**:
- "A Chrome extension that uses AI to summarize YouTube videos and save notes to Notion"
- "A Discord bot for managing hackathon teams with role assignments and notifications"
- "A mobile app for tracking daily water intake with reminder notifications"

**Poor examples**:
- "App" (too vague)
- "Build something cool" (no specifics)
- "Enterprise-grade microservices architecture with machine learning" (too ambitious for 24h)

### Choosing Experience Level

- **Beginner**: First hackathon, learning new tools, want simple setup
- **Intermediate**: Comfortable with development, done 2-3 hackathons
- **Advanced**: Experienced developer, can work fast, comfortable with complex stacks

### Managing Expectations

- The tool optimizes for **24-hour hackathons**
- Aim to build a **demo**, not production software
- If feasibility is "not feasible", **listen to the recommendations**
- Start with the **recommended tech stack** unless you have strong reasons to change

## Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=true npm run dev
```

This shows:
- API request/response details
- Retry attempts
- Internal processing steps
- Validation checks

## Getting Help

If you're still stuck:

1. **Check existing issues**: [GitHub Issues](https://github.com/wildhash/gradient-coach/issues)
2. **Create a new issue**: Include:
   - Error message (full text)
   - Command you ran
   - Debug logs (if possible)
   - Node.js version: `node --version`
3. **Contact**: Open an issue with the `help-wanted` label

## Environment Verification

Verify your environment is set up correctly:

```bash
# Check Node.js version (need 18+)
node --version

# Check if API key is set
echo $ANTHROPIC_API_KEY

# Try a simple test
npm run dev -- --version
```

Expected output:
```
1.0.0
```

## Common Workflow Issues

### Interactive Mode Gets Stuck

**Issue**: Prompts don't respond to input.

**Solution**:
1. Try command-line mode instead:
   ```bash
   npm run dev -- coach --idea "Your idea" --experience intermediate
   ```
2. Check terminal compatibility
3. Update Node.js to latest LTS version

### Output Files Not Created

**Issue**: Command completes but no files generated.

**Solution**:
1. Check the output path in the success message
2. Use absolute path for `--output`:
   ```bash
   npm run dev -- coach --output "$(pwd)/output"
   ```
3. Verify write permissions

### Scaffold Generation Fails

**Issue**: Scaffold files not generated even with `--scaffold` flag.

**Solution**:
1. Check that generation completed successfully
2. Look in `output/scaffold/` subdirectory
3. Verify AI service didn't timeout during scaffold generation
4. Try without scaffold first, then regenerate with scaffold

## Performance Issues

### Slow Response Times

**Causes**:
- Network latency
- AI service load
- Complex project descriptions

**Solutions**:
- Simplify project description
- Try during off-peak hours
- Check network connection speed

### Timeouts

**Cause**: AI service taking too long to respond.

**Solution**:
- Tool has automatic retry with backoff
- Wait for retries to complete (up to 3 attempts)
- If all retries fail, try again later
- Consider simpler project scope

## Testing Your Setup

Quick test to verify everything works:

```bash
export ANTHROPIC_API_KEY=your-key-here
npm run build
npm test
npm run dev -- coach \
  --idea "A simple todo list app" \
  --experience beginner \
  --output ./test-output
```

Should generate:
- `test-output/gradient-coach-report.json`
- `test-output/README.md`
- `test-output/cline-tasks.json`

If this works, your setup is correct!
