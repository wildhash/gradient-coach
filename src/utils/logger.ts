import ora, { Ora } from 'ora';

/**
 * Logging utility for Gradient Coach
 * Provides consistent, professional logging across the application
 */

type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export class Logger {
  private debugMode: boolean;
  private currentSpinner: Ora | null = null;

  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode || process.env.DEBUG === 'true';
  }

  info(message: string): void {
    this.stopSpinner();
    console.log(`ℹ️  ${message}`);
  }

  success(message: string): void {
    this.stopSpinner();
    console.log(`✅ ${message}`);
  }

  warning(message: string): void {
    this.stopSpinner();
    console.log(`⚠️  ${message}`);
  }

  error(message: string): void {
    this.stopSpinner();
    console.error(`❌ ${message}`);
  }

  debug(message: string): void {
    if (this.debugMode) {
      this.stopSpinner();
      console.log(`🔍 [DEBUG] ${message}`);
    }
  }

  step(message: string): void {
    this.stopSpinner();
    console.log(`\n${message}`);
  }

  result(label: string, value: string | number | boolean): void {
    console.log(`   ${label}: ${value}`);
  }

  section(title: string): void {
    this.stopSpinner();
    console.log(`\n${title}`);
  }

  /**
   * Start a spinner with a message
   */
  startSpinner(message: string): void {
    this.stopSpinner();
    this.currentSpinner = ora({
      text: message,
      color: 'cyan',
    }).start();
  }

  /**
   * Update the spinner message
   */
  updateSpinner(message: string): void {
    if (this.currentSpinner) {
      this.currentSpinner.text = message;
    }
  }

  /**
   * Stop the spinner with success
   */
  succeedSpinner(message?: string): void {
    if (this.currentSpinner) {
      this.currentSpinner.succeed(message);
      this.currentSpinner = null;
    }
  }

  /**
   * Stop the spinner with failure
   */
  failSpinner(message?: string): void {
    if (this.currentSpinner) {
      this.currentSpinner.fail(message);
      this.currentSpinner = null;
    }
  }

  /**
   * Stop the spinner with warning
   */
  warnSpinner(message?: string): void {
    if (this.currentSpinner) {
      this.currentSpinner.warn(message);
      this.currentSpinner = null;
    }
  }

  /**
   * Stop any active spinner
   */
  private stopSpinner(): void {
    if (this.currentSpinner) {
      this.currentSpinner.stop();
      this.currentSpinner = null;
    }
  }
}

// Default logger instance
export const logger = new Logger();
