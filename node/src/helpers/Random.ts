export class Random {
  static number(size = 1): number {
    return Math.floor(Math.random() * size);
  }

  static string(length: number): string {
    if (length < 1) throw new InvalidArgumentException('length must be bigger than 0');
    return new Array(length)
      .fill(null)
      .map(() => String.fromCharCode(97 + this.number(26)))
      .join('');
  }
}

export class InvalidArgumentException extends Error {
  name = 'InvalidArgumentException';
}
