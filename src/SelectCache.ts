/**
 * Cache object to store selected values in String Select object
 * because they are not included by default in the object
 * in discordjs
 *
 * For usecase, every stringSelect object stores one selected value
 */

export class SelectCache {
  _cache: Map<string, string>;

  constructor() {
    this._cache = new Map<string, string>();
  }
  push(selector: string, value: string) {
    this._cache.set(selector, value);
  }
  exists(selector: string): boolean {
    return this._cache.has(selector);
  }

  pop(selector: string): string | undefined {
    let ret = this._cache.get(selector);
    this._cache.delete(selector);
    return ret;
  }
}

export const selectCache = new SelectCache();
