import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

dotenv.config();

const config: Partial<Cypress.UserConfigOptions<any>> = {
  downloadsFolder: 'test/downloads',
  fixturesFolder: 'test/fixtures',
  port: 4444,
  watchForFileChanges: false,
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    setupNodeEvents(on, config) {
      return require('./test/plugins/index.ts').default(on, config);
    },
    specPattern: 'test/integration/*.spec.ts',
    supportFile: 'test/support/index.ts',
    baseUrl: 'http://localhost:3000',
  },
};

if (process.env.CYPRESS_PROJECT_ID) {
  config.projectId = process.env.CYPRESS_PROJECT_ID;
}

export default defineConfig(config);
