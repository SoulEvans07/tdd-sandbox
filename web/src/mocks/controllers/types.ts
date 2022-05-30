import { RestHandler } from 'msw';
import { ControllerBase } from '../../controllers/types';

export type MockController<C extends ControllerBase> = Record<keyof C, RestHandler>;

export type ErrorResponse = { message: string };
