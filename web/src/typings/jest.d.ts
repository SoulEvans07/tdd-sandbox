interface CustomMatchers<R = unknown> {
  toThrowType(errorType: new () => Error): R;
}

declare namespace jest {
  interface Matchers<R> extends CustomMatchers<R> {}
}
