import { RestHandler } from 'msw';
import { ApiManager } from '@tdd-sandbox/api-managers';

export type MockApiManager<C extends ApiManager> = Record<keyof C, RestHandler>;

export type ErrorResponse = { message: string };
