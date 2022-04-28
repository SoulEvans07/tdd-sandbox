import { IStack, UnderflowError } from './IStack';

export class ArrayStack<T> implements IStack<T> {
  private elements: T[] = [];

  getSize(): number {
    return this.elements.length;
  }

  isEmpty(): boolean {
    return this.getSize() === 0;
  }

  push(value: T): void {
    this.elements[this.elements.length] = value;
  }

  pop(): T {
    if (this.isEmpty()) throw new UnderflowError();
    const last = this.elements[this.elements.length - 1];
    this.elements.length--;
    return last;
  }
}
