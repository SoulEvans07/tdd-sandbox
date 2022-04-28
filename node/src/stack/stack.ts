export interface IStack {
  getSize(): number;
  isEmpty(): boolean;
  push(value: number): void;
  pop(): number;
  getElements(): number[];
}

export class Stack implements IStack {
  private elements: number[] = [];

  getElements(): number[] {
    return this.elements;
  }

  getSize(): number {
    return this.elements.length;
  }

  isEmpty(): boolean {
    return this.getSize() === 0;
  }

  push(value: number): void {
    this.elements[this.elements.length] = value;
  }

  pop(): number {
    if (this.isEmpty()) throw new UnderflowError();
    const last = this.elements[this.elements.length - 1];
    this.elements.length--;
    return last;
  }
}

export class UnderflowError extends Error {
  name = 'UnderflowError';
}
