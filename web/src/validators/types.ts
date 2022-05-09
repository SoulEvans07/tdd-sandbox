import { ChangeEvent } from 'react';

export type InputValidator = (e: ChangeEvent<HTMLInputElement>) => string | null;
