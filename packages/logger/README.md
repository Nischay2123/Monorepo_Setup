# @job-finder/logger

A shared logging utility based on [Pino](https://getpino.io/).

## Features

- **Structured Logging**: Automatic JSON formatting in production.
- **Pretty Printing**: Human-readable, colored output in development.
- **Service Isolation**: Each logger is tagged with its service name.
- **Error Handling**: Enhanced error logging including stack traces and causes.
- **Environment Aware**: Automatically switches between production and development modes.

## Installation

The package is available as an internal workspace package.

```json
{
  "dependencies": {
    "@job-finder/logger": "*"
  }
}
```

## Usage

### Basic Usage

```typescript
import { createLogger } from '@job-finder/logger';

const logger = createLogger('API');

logger.info('Server started');
logger.debug('Database connection string: ...');
```

### Structured Metadata

```typescript
logger.info('User Login', {
  userId: '123',
  email: 'user@example.com'
});
```

### Error Logging

Pass the error object as the second argument to capture full stack traces and causes.

```typescript
try {
  // some logic
} catch (error) {
  logger.error('Job Sync Failed', error);
}
```

## Development vs Production

- **Development (`NODE_ENV=development` or unset)**:
  - Uses `pino-pretty` for readable console output.
  - Level defaults to `debug`.
  - Colored output with timestamps.
- **Production (`NODE_ENV=production`)**:
  - Raw JSON output for ingestion by log aggregators (ELK, CloudWatch, etc.).
  - Level defaults to `info`.
  - Optimized for performance.
