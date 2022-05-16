export type InputValidator = (value: string) => string | null;

export const strongPasswordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;
