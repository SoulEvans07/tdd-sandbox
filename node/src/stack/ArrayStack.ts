import { IStack, UnderflowError } from './IStack';

export class ArrayStack implements IStack {
  private elements: number[] = [];

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
