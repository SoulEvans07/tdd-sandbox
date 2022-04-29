interface CustomMatchers<R = unknown> {
  toBeWithinRange(floor: number, ceiling: number): R;
  toThrowType(errorType: new () => Error): R;
}

namespace jest {
  interface Expect extends CustomMatchers {}
  interface Matchers<R> extends CustomMatchers<R> {}
  interface InverseAsymmetricMatchers extends CustomMatchers {}
}
