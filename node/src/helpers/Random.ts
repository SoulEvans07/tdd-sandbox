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

  static choose<T>(array: T[]): T;
  static choose<T>(array: T[], count: number): T[];
  static choose<T>(array: T[], count?: number): T | T[] {
    if (count === undefined) return array[this.number(array.length - 1)];
    if (count < 1) throw new InvalidArgumentException('count must be bigger than 0');

    const randomized = [...array].sort(() => (Math.random() > 0.5 ? 1 : -1));
    return randomized.slice(0, count);
  }
}

export class InvalidArgumentException extends Error {
  name = 'InvalidArgumentException';
}
