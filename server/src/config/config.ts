import dotenv from 'dotenv';

const isTestMode = process.env.NODE_ENV === 'test';

if (!isTestMode) {
  dotenv.config();
} else {
  dotenv.config({ path: '.env.test' });
}

function tryParseInt(value?: string): number | undefined {
  if (!value) return;
  const v = Number.parseInt(value, 10);
  if (v !== NaN) return v;
}

function getValueOrDefault<T>(target: string | undefined, parser: (v: string) => T | undefined, defaultV: T): T {
  const value = target ? parser(target) : undefined;
  return value ? value : defaultV;
}

const port: number = getValueOrDefault<number>(process.env.PORT, tryParseInt, 3000);
const logger = process.env.LOGGER === 'true';
const tokenKey = process.env.JWT_TOKEN_KEY as string;
const expiresIn = process.env.JWT_EXPIRES_IN as string;
const issuer = process.env.JWT_ISSUER as string;
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbSource = process.env.DB_SOURCE as string;
const dbLogger = process.env.DB_LOGGER === 'true';

const config = {
  server: {
    port,
    cors: { origin: new RegExp(/http(s)?:\/\/localhost:3000/) },
  },
  security: {
    tokenKey,
    expiresIn,
    issuer,
  },
  logger: {
    enabled: logger,
  },
  database: {
    name: dbName,
    user: dbUser,
    password: dbPassword,
    storage: dbSource,
    logger: dbLogger,
  },
};

export default config;
