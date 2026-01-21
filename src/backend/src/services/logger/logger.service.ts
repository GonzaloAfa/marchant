import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly isProduction: boolean;
  private readonly logLevel: LogLevel;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
    const level = this.configService.get('LOG_LEVEL', 'info').toLowerCase();
    this.logLevel = this.getLogLevel(level);
  }

  private getLogLevel(level: string): LogLevel {
    switch (level) {
      case 'error':
        return LogLevel.ERROR;
      case 'warn':
        return LogLevel.WARN;
      case 'info':
        return LogLevel.INFO;
      case 'debug':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatMessage(level: string, message: string, context?: string, ...args: any[]): any {
    const timestamp = new Date().toISOString();
    const logData: any = {
      timestamp,
      level: level.toUpperCase(),
      message,
    };

    if (context) {
      logData.context = context;
    }

    if (args.length > 0) {
      logData.data = args.length === 1 ? args[0] : args;
    }

    return logData;
  }

  private formatForDevelopment(level: string, message: string, context?: string, ...args: any[]): string {
    const colors = {
      error: '\x1b[31m', // Red
      warn: '\x1b[33m', // Yellow
      info: '\x1b[36m', // Cyan
      debug: '\x1b[35m', // Magenta
      reset: '\x1b[0m',
      dim: '\x1b[2m',
      bright: '\x1b[1m',
    };

    const color = colors[level.toLowerCase() as keyof typeof colors] || colors.reset;
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const argsStr = args.length > 0 ? ` ${JSON.stringify(args.length === 1 ? args[0] : args, null, 2)}` : '';

    return `${colors.dim}${timestamp}${colors.reset} ${color}${colors.bright}[${level.toUpperCase()}]${colors.reset}${color}${contextStr}${colors.reset} ${message}${argsStr}`;
  }

  private log(level: LogLevel, levelName: string, message: string, context?: string, ...args: any[]): void {
    if (!this.shouldLog(level)) {
      return;
    }

    if (this.isProduction) {
      // Production: JSON format
      const logData = this.formatMessage(levelName, message, context, ...args);
      const jsonString = JSON.stringify(logData);
      console.log(jsonString);
    } else {
      // Development: Colored format
      const formattedMessage = this.formatForDevelopment(levelName, message, context, ...args);
      console.log(formattedMessage);
    }
  }

  error(message: string, context?: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, 'error', message, context, ...args);
  }

  warn(message: string, context?: string, ...args: any[]): void {
    this.log(LogLevel.WARN, 'warn', message, context, ...args);
  }

  info(message: string, context?: string, ...args: any[]): void {
    this.log(LogLevel.INFO, 'info', message, context, ...args);
  }

  debug(message: string, context?: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, 'debug', message, context, ...args);
  }

  log(message: string, context?: string, ...args: any[]): void {
    this.info(message, context, ...args);
  }

  verbose(message: string, context?: string, ...args: any[]): void {
    this.debug(message, context, ...args);
  }

  // Helper method for multi-line logs (like email content)
  logMultiline(lines: string[], context?: string): void {
    if (this.isProduction) {
      // Production: Single JSON log
      const logData = this.formatMessage('info', 'Multi-line log', context, { lines });
      const jsonString = JSON.stringify(logData);
      console.log(jsonString);
    } else {
      // Development: Print each line with formatting
      lines.forEach((line) => {
        const formattedMessage = this.formatForDevelopment('info', line, context);
        console.log(formattedMessage);
      });
    }
  }
}
