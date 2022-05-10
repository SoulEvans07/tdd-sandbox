import { getPing } from './getPing';
import { postRegister } from './auth/postRegister';
import { postLogin } from './auth/postLogin';

export const handlers = [getPing, postRegister, postLogin];
