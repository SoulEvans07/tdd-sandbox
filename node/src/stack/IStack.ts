export interface IStack<T> {
  getSize(): number;
  isEmpty(): boolean;
  push(value: T): void;
  pop(): T;
  top(): T;
}

export class UnderflowError extends Error {
  name = 'UnderflowError';
}
