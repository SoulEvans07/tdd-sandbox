import express, { Express } from 'express';

import path from 'path';
import fs from 'fs';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';

import { getEpMeta } from './decorators/api.decorators';
import { Logger } from './utils/Logger';
import { Controllers } from './types/api';
import helmet from 'helmet';
import cors from 'cors';
import ApiErrorHandler from './middleware/ApiErrorHandler';
import ValidationMiddleware from './middleware/ValidationMiddleware';

export const baseUrl: string = '/api';
export const app: Express = express();

app.use(helmet());
app.use(
  cors({
    origin: new RegExp(/http(s)?:\/\/localhost:3000/),
  })
);

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: './src/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      lookupHeader: 'accept-language',
    },
  });

app.use(middleware.handle(i18next));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

attachControllers(app);

async function attachControllers(app: Express) {
  const controllers: Controllers = {};

  const controllerDir = path.join(__dirname, 'controllers');
  const files = await new Promise<string[]>(res => fs.readdir(controllerDir, (_, files) => res(files)));
  const controllersPaths = files.filter(f => /Controller\.(ts|js)$/.test(f)).map(f => path.join(controllerDir, f));

  controllersPaths.forEach(controllerPath => {
    const router = express.Router();
    const ClassType = require(controllerPath).default;
    if (ClassType) {
      const controllerObject = new ClassType();
      controllers[ClassType.prototype.constructor.name] = controllerObject;

      Logger.log(`Controller found: ${ClassType.prototype.constructor.name}`);

      Object.getOwnPropertyNames(ClassType.prototype).forEach(methodName => {
        const apiMeta = getEpMeta(controllerObject, methodName);
        if (apiMeta) {
          const apiUrl = `${baseUrl}/${apiMeta.version}/${apiMeta.path}`;
          Logger.log(`Controller method found ${methodName}, ${apiMeta.method.toUpperCase()} ${apiUrl}`);
          router[apiMeta.method](
            apiUrl,
            ...(apiMeta.middleware && apiMeta.middleware.length > 0
              ? apiMeta.middleware
              : [(_: unknown, __: unknown, next: () => void) => next()]),
            ValidationMiddleware.throwValidationErrors,
            controllerObject[methodName].bind(controllerObject)
          );
        }
      });

      app.use(router);
    }
  });

  app.use(ApiErrorHandler.handleError);
}
