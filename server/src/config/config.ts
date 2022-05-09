import dotenv from 'dotenv';

const isTestMode = process.env.NODE_ENV === 'test';

if (!isTestMode) {
  dotenv.config();
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
const logger: boolean = process.env.LOGGER !== 'false';
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbSource = process.env.DB_SOURCE;

const config = {
  server: {
    port,
  },
  logger: {
    enabled: logger,
  },
  database: {
    name: dbName,
    user: dbUser,
    password: dbPassword,
    storage: dbSource,
  },
};

export default config;
