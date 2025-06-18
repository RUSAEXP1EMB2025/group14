interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

function createLogger(): Logger {
  const timestamp = () => new Date().toISOString();

  return {
    info: (message: string, ...args: unknown[]) => {
      console.log(`[${timestamp()}] [INFO] ${message}`, ...args);
    },
    error: (message: string, ...args: unknown[]) => {
      console.error(`[${timestamp()}] [ERROR] ${message}`, ...args);
    },
    warn: (message: string, ...args: unknown[]) => {
      console.warn(`[${timestamp()}] [WARN] ${message}`, ...args);
    },
    debug: (message: string, ...args: unknown[]) => {
      console.debug(`[${timestamp()}] [DEBUG] ${message}`, ...args);
    }
  };
}

export const logger = createLogger();
