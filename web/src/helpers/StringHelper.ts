export class StringHelper {
  static camelToKebab(input: string): string {
    return input.replace(/\B([A-Z])\B/g, '-$1').toLowerCase();
  }
}
