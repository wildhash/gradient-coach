/**
 * Logging utility for Gradient Coach
 * Provides consistent, professional logging across the application
 */

type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

export class Logger {
  private debugMode: boolean;

  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode || process.env.DEBUG === 'true';
  }

  info(message: string): void {
    console.log(`ℹ️  ${message}`);
  }

  success(message: string): void {
    console.log(`✅ ${message}`);
  }

  warning(message: string): void {
    console.log(`⚠️  ${message}`);
  }

  error(message: string): void {
    console.error(`❌ ${message}`);
  }

  debug(message: string): void {
    if (this.debugMode) {
      console.log(`🔍 [DEBUG] ${message}`);
    }
  }

  step(message: string): void {
    console.log(`\n${message}`);
  }

  result(label: string, value: string | number | boolean): void {
    console.log(`   ${label}: ${value}`);
  }

  section(title: string): void {
    console.log(`\n${title}`);
  }
}

// Default logger instance
export const logger = new Logger();
