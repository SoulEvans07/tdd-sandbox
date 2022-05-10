import { RestHandler } from 'msw';
import { ControllerBase } from '../../controllers/types';

export type MockController<C extends ControllerBase> = Record<keyof C, RestHandler>;
