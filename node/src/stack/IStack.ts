export interface IStack {
  getSize(): number;
  isEmpty(): boolean;
  push(value: number): void;
  pop(): number;
}

export class UnderflowError extends Error {
  name = 'UnderflowError';
}
