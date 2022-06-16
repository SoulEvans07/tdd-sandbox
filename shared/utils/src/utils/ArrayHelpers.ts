export type ListPickTuple<LI extends Record<string, any>, P extends keyof LI> = [Array<LI>, Array<LI[P]>];

export class ArrayHelpers {
  static cycle<T>(array: T[], count = 1): T[] {
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

  static filterBy<T extends Record<string, any>>(array: T[], key: keyof T, filter?: T[typeof key]): T[] {
    return array.filter(item => !filter || item[key] === filter);
  }

  static filterPickBy<T extends Record<string, any>>(
    array: T[],
    pick: keyof T,
    key: keyof T,
    filter?: T[typeof key]
  ): ListPickTuple<T, typeof key> {
    return array.reduce(
      (acc: ListPickTuple<T, typeof key>, curr: T) => {
        if (!filter || curr[key] === filter) {
          acc[0].push(curr);
          acc[1].push(curr[pick]);
        }
        return acc;
      },
      [[], []]
    );
  }
}
