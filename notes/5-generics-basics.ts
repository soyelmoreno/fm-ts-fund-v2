import { HasEmail } from "./1-basics";

/**
 * (1) Generics allow us to parameterize *types* in the same way that
 * -   functions parameterize *values*
 */

// param determines the value of x
function wrappedValue(x: any) {
  return {
    value: x,
  };
}

// type param determines the type of x
interface WrappedValue<X> {
  value: X;
}

// Example. Instead of passing an argument to a function, we pass a type (string
// array) to a generic type
let val: WrappedValue<string[]> = { value: [] };
val.value;

/**
 * we can name these params whatever we want, but a common convention is to use
 * capital letters starting with `T` (a C++ convention from "templates")
 */

/**
 * (2) Type parameters can have default types
 * -   just like function parameters can have default values
 */

// for Array.prototype.filter (fall back to an "any" if no type is provided)
interface FilterFunction<T = any> {
  (val: T): boolean;
}

const stringFilter: FilterFunction<string> = (val) => typeof val === "string";
stringFilter(0); // 🚨 ERROR
stringFilter("abc"); // ✅ OK

// can be used with any value
const truthyFilter: FilterFunction = (val) => val;
truthyFilter(0); // false
truthyFilter(1); // true
truthyFilter(""); // false
truthyFilter(["abc"]); // true

/**
 * (3) You don't have to use exactly your type parameter as an arg
 * -   things that are based on your type parameter are fine too
 */

function resolveOrTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    // start the timeout, reject when it triggers
    const task = setTimeout(() => reject("time up!"), timeout);

    promise.then((val) => {
      // cancel the timeout
      clearTimeout(task);

      // resolve with the value
      resolve(val);
    });
  });
}
resolveOrTimeout(fetch(""), 3000);

/**
 * (4) Type parameters can have constraints
 */

// This is the constraint part:
//                     vvvvvvvvvvvvvvvvvvvvvv
function arrayToDict<T extends { id: string }>(array: T[]): { [k: string]: T } {
  const out: { [k: string]: T } = {};
  array.forEach((val) => {
    // If we need to do something with .id, then we need to specify that T must
    // have an 'id' property
    out[val.id] = val;
  });
  return out;
}

// We could try the above with no T, just put {id: string} in its place...
// ...but then we get errors if we pass an object that has more properties than
// just id as a string.
const myDict = arrayToDict([
  { id: "a", value: "first", lisa: "Huang" },
  { id: "b", value: "second" },
]);
// We would also lose access to the type information of whatever is passed in.
// So with the T, we say, "whatever you give me, i.e., an array of type T, I'm
// gonna give you a dictionary of type T out. You'll still be working with
// whatever type that you pass in, just in dictionary form."

// By making it a generic, we can retain the detail of the object that was
// passed in, even though the function that was doing the work knows nothing
// about the extra properties that might be there.

// myDict.foo.

/**
 * (5) Type parameters are associated with scopes, just like function arguments
 */

function startTuple<T>(a: T) {
  // Out here we cannot access b or U
  return function finishTuple<U>(b: U) {
    // In here we can access both a and b, and T and U
    return [a, b] as [T, U];
  };
}
const myTuple = startTuple(["first"])(42);

/**
 * (6) When to use generics
 *
 * - Generics are necessary when we want to describe a relationship between two
 *   or more types (i.e., a function argument and return type).
 *
 * - Aside from interfaces and type aliases, if a type parameter is used only
 *   once it can probably be eliminated
 */

interface Shape {
  draw();
}
interface Circle extends Shape {
  radius: number;
}

function drawShapes1<S extends Shape>(shapes: S[]) {
  shapes.forEach((s) => s.draw());
}

function drawShapes2(shapes: Shape[]) {
  // this is simpler. Above type param is not necessary
  shapes.forEach((s) => s.draw());
}

// General rule: "Ask for only what you need." (i.e., the function parameter
// type). Because you don't want to be overly restrictive. "Return everything
// you can." Because you want your consumers to be able to access all of the
// richness of this object.

// Question: can you show an example where you would actually *want* to use the
// generic type parameter? Yes, we would need to have something else, a second
// use of the type parameter.
type Shape2 = {
  draw();
  isDrawn: boolean;
};
interface Circle2 extends Shape2 {
  radius: number;
}
// Now we're using it in two places -----------V  ---V 
function drawShapes3<S extends Shape2>(shapes: S[]): S[] {
// function drawShapes3<S extends Shape2>(shapes: S[]): Shape2[] {
  // If we just returned : Shape2[] it would be bad, we would be reducing it
  // down to the least common denominator, only returning properties that Shape2
  // has, losing anything that Circle or Square or any more specific shapes
  // might have.
  return shapes.map((s) => {
    s.draw();
    s.isDrawn = true;
    return s;
  });
}
const cir: Circle2 = {draw() {}, radius: 4, isDrawn: false};
// When we map each shape, and say we want to chain off of it, if Shape2[] was
// returned then we lose information. It's reduced down to an array of Shape2s
// with 'draw()' and 'isDrawn', it's no longer an array of Circle2s that also
// has 'radius'. I didn't get out what I passed in, instead I got out the lowest
// common denominator that the function needed. 
drawShapes3([cir]).map(c => c.) // <--- only shows 'draw()' and 'isDrawn'
// Whereas if we return an array of S[]s, we get 'radius', too.
drawShapes3([cir]).map(c => c.) // <--- shows 'draw()', 'isDrawn', and 'radius'
// So that's when it makes sense to use the type parameter, because it's used
// both as the type for the argument and as the type for the return value. So
// now it actually gets you something. It's describing a relationship between
// arguments and return.

