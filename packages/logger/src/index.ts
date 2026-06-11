import { pino, LoggerOptions, Logger } from 'pino';

export type { Logger } from 'pino';

export const createLogger = (serviceName: string): Logger => {
  const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

  const options: LoggerOptions = {
    name: serviceName,
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    hooks: {
      logMethod(inputArgs, method) {
        const arg1 = inputArgs[1];
        if (inputArgs.length >= 2 && arg1 && typeof arg1 === 'object' && 'message' in arg1 && 'stack' in arg1) {
          const msg = inputArgs[0] as string;
          const err = arg1 as Error;
          const rest = inputArgs.slice(2);
          
          return method.apply(this, [
            {
              msg,
              err: {
                message: err.message,
                stack: err.stack,
                cause: err.cause,
              },
              ...rest,
            },
          ]);
        }
        return method.apply(this, inputArgs);
      },
    },
  };

  if (isDevelopment) {
    return pino({
      ...options,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
          translateTime: 'SYS:standard',
          messageFormat: '{msg}',
        },
      },
    });
  }

  return pino(options);
};
