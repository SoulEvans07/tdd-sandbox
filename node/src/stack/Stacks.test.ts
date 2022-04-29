import { IStack, UnderflowError } from './IStack';
import { Random } from '../helpers/Random';
import { ArrayStack } from './ArrayStack';
import { MapStack } from './MapStack';

describe('Stacks', () => {
  testGenericFunctionality('number', () => Random.number(100));
  testGenericFunctionality('string', () => Random.string(8));
});

function testGenericFunctionality(typeName: string, valueGen: () => any) {
  describe(`<T = ${typeName}>`, () => {
    testStackFunctionality(`ArrayStack<${typeName}>`, () => new ArrayStack(), valueGen);
    testStackFunctionality(`MapStack<${typeName}>`, () => new MapStack(), valueGen);
  });
}

function testStackFunctionality<T>(name: string, ctor: () => IStack<T>, valueGen: () => T): void {
  describe(name, () => {
    let stack: IStack<T>;

    beforeEach(() => {
      stack = ctor();
    });

    test('new stack should be empty; with size of 0', () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.getSize()).toBe(0);
    });

    test('after one push stack should not be empty', () => {
      stack.push(valueGen());
      expect(stack.isEmpty()).toBe(false);
    });

    test('will throw underflow error when empty stack is popped', () => {
      expect(() => stack.pop()).toThrowType(UnderflowError);
    });

    test('after one push and one pop stack will be empty; with size of 0', () => {
      stack.push(valueGen());
      stack.pop();
      expect(stack.isEmpty()).toBe(true);
      expect(stack.getSize()).toBe(0);
    });

    test('after two pushes and one pop stack will not be empty', () => {
      stack.push(valueGen());
      stack.push(valueGen());
      stack.pop();
      expect(stack.isEmpty()).toBe(false);
    });

    test('after pushing X times, size should be X', () => {
      const x = 1 + Random.number(10); // X > 0
      for (let i = 0; i < x; i++) stack.push(valueGen());
      expect(stack.getSize()).toBe(x);
    });

    test('after pushing X will pop X; repeated 3 times', () => {
      for (let i = 0; i < 3; i++) {
        const x = valueGen();
        stack.push(x);
        expect(stack.pop()).toBe(x);
      }
    });

    test('after pushing X times then popping Y tiems, size should be X-Y', () => {
      const y = 1 + Random.number(10); // Y > 0
      const x = y + Random.number(10); // X > Y
      for (let i = 0; i < x; i++) stack.push(valueGen());
      for (let i = 0; i < y; i++) stack.pop();
      expect(stack.getSize()).toBe(x - y);
    });

    test('FILO - first pushed in gets popped out last', () => {
      const first = valueGen();
      const last = valueGen();
      stack.push(first);
      stack.push(last);
      stack.pop();
      expect(stack.pop()).toBe(first);
    });

    test('FILO - pushed items get popped in reverse order', () => {
      const size = 5;
      const items = new Array(size).fill(null).map(() => valueGen());
      items.forEach(item => stack.push(item));
      const reverse = items.reverse();
      reverse.forEach(item => expect(stack.pop()).toBe(item));
    });

    test('top on empty stack throws Underflow error', () => {
      expect(() => stack.top()).toThrowType(UnderflowError);
    });

    test('push once, top once -> stack is not empty', () => {
      stack.push(valueGen());
      stack.top();
      expect(stack.isEmpty()).toBe(false);
    });

    test('top doesnt change the stack size', () => {
      const count = 1 + Random.number(9);
      for (let i = 0; i < count; i++) stack.push(valueGen());
      stack.top();
      expect(stack.getSize()).toBe(count);
    });

    test('top returns last pushed item', () => {
      const count = 1 + Random.number(9);
      const values = new Array(count).fill(null).map(() => valueGen());
      values.forEach(val => stack.push(val));
      expect(stack.top()).toBe(values[values.length - 1]);
    });
  });
}
