export class ArrayHelpers {
  static cycle<T>(array: T[], count: number = 1): T[] {
    const cycles = count % array.length;
    const start = array.slice(0, cycles);
    const end = array.slice(cycles);
    return [...end, ...start];
  }

  static next<T>(array: T[], item: typeof array[number]): T {
    const nextIndex = array.indexOf(item) + 1;
    const nextValidIndex = nextIndex % array.length;
    return array[nextValidIndex];
  }
}
