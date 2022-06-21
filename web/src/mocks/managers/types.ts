import { RestHandler } from 'msw';
import { ApiManager } from '../../managers/types';

export type MockApiManager<C extends ApiManager> = Record<keyof C, RestHandler>;

export type ErrorResponse = { message: string };
