// Want a dictionary that will hold key/value pairs for whatever type you pass
// in. Since we don't know the type, we use a generic type
export type Dict<T> = {
  // key with arbitrary label, but definitely type T.
  // But it might not exist, so "T | undefined"
  [anythingWeWant: string]: T | undefined;
};

// Array.prototype.map, but for Dict. Dict needs an argument T, so function
// needs a <T> to indicate the type parameter. Mapping function will iterate
// over an array and transform values, potentially from one type to another.
export function mapDict<T, S>(
  dict: Dict<T>,
  fn: (arg: T, idx: number) => S
): Dict<S> {
  const out: Dict<S> = {};
  Object.keys(dict).forEach((dKey, idx) => {
    let currentItem = dict[dKey];
    if (typeof currentItem !== "undefined") {
      out[dKey] = fn(currentItem, idx);
    }
  });
  return out;
}

// Now let's use the mapDict() function with Dictionaries of different types
// Hover mapDict...returns Dict<string>
mapDict({ a: "a", b: "b" }, (str) => str);
// Hover mapDict...returns Dict<string[]>
mapDict({ a: "a", b: "b" }, (str) => [str]);
// Hover mapDict...returns Dict<number>
mapDict({ a: 456, b: 123 }, (str) => str);
// Hover mapDict...returns Dict<{val: string}>
mapDict({ a: "a", b: "b" }, (str) => ({ val: str }));

// Array.prototype.reduce, but for Dict
export function reduceDict() {}
