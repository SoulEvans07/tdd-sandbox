import { IStack, UnderflowError } from './IStack';

export class MapStack implements IStack {
  private size: number = 0;
  private elements: Record<string, number> = Object.create(null);

  getSize(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.getSize() === 0;
  }

  push(value: number): void {
    this.elements[this.size++] = value;
  }

  pop(): number {
    if (this.isEmpty()) throw new UnderflowError();
    const last = this.elements[this.size - 1];
    delete this.elements[this.size];
    this.size--;
    return last;
  }
}
