import { IStack, Stack, UnderflowError } from './stack';

const getRandomNumber = (size: number) => Math.round(Math.random() * size);

describe('Stacks', () => {
  let stack: IStack;

  beforeEach(() => {
    stack = new Stack();
  });

  test('new stack should be empty; with size of 0', () => {
    expect(stack.isEmpty()).toBe(true);
    expect(stack.getSize()).toBe(0);
  });

  test('after one push stack should not be empty', () => {
    stack.push(0);
    expect(stack.isEmpty()).toBe(false);
  });

  test('will throw underflow error when empty stack is popped', () => {
    expect(() => stack.pop()).toThrowError(new UnderflowError());
  });

  test('after one push and one pop stack will be empty; with size of 0', () => {
    stack.push(0);
    stack.pop();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.getSize()).toBe(0);
  });

  test('after two pushes and one pop stack will not be empty', () => {
    stack.push(0);
    stack.push(1);
    stack.pop();
    expect(stack.isEmpty()).toBe(false);
  });

  test('after pushing X times, size should be X', () => {
    const x = 1 + getRandomNumber(10); // X > 0
    for (let i = 0; i < x; i++) stack.push(i);
    expect(stack.getSize()).toBe(x);
  });

  test('after pushing X will pop X; repeated 3 times', () => {
    for (let i = 0; i < 3; i++) {
      const x = getRandomNumber(100);
      stack.push(x);
      expect(stack.pop()).toBe(x);
    }
  });

  test('after pushing X times then popping Y tiems, size should be X-Y', () => {
    const y = 1 + getRandomNumber(10); // Y > 0
    const x = y + getRandomNumber(10); // X > Y
    for (let i = 0; i < x; i++) stack.push(i);
    for (let i = 0; i < y; i++) stack.pop();
    expect(stack.getSize()).toBe(x - y);
  });

  test('FILO - first pushed in gets popped out last', () => {
    const first = getRandomNumber(100);
    const last = getRandomNumber(100);
    stack.push(first);
    stack.push(last);
    stack.pop();
    expect(stack.pop()).toBe(first);
  });

  test('FILO - pushed items get popped in reverse order', () => {
    const size = 5;
    const items = new Array(size).fill(null).map(() => getRandomNumber(100));
    items.forEach(item => stack.push(item));
    const reverse = items.reverse();
    reverse.forEach(item => expect(stack.pop()).toBe(item));
  });
});
