/**
 * Create a promise that resolves after some time
 * @param n number of milliseconds before promise resolves
 */
function timeout(n: number) {
  return new Promise(res => setTimeout(res, n));
}

/**
 * Add three numbers
 * @param a first number
 * @param b second
 */
export async function addNumbers(a: number, b: number) {
  await timeout(500);
  return a + b;
}

//== Run the program ==//
(async () => {
  console.log('result is', await addNumbers(3, 4));
})();

/*
- Install typescript globally
  $ npm install typescript -g
- Can run this to compile index.ts down to index.js
  $ tsc src/index.ts
- Now you have index.js, with plain old JavaScript.
- It's tons of code, 78 lines.
- By default you get ES3, which works in IE6.
- Can add a flag for later ECMAScript spec.
  --target ES2015  => Now the compiled JS has Promises. 32 lines
  --target ES2017  => Now the JS has async/await. 24 lines
- Now try to run the JS file in Node
  $ node src/index.js
- We get an error. JS uses `export`, but NodeJS uses CommonJS style, with
  modules.export.
- There's a flag for that
  $ tsc src/index.ts --target ES2017 --module commonjs
- Now we can run it in Node, and it works.
- Can also add a --watch flag so that it compiles when source file is changed
  and saved.
*/

/*
- These commands with flags get big and cumbersome. Conventional solution is to
  use a configuration file instead.
    examples/hello-ts/src/tsconfig.json
- Two things you need to do:
  1. Define which files are the inputs, by either specifying a list of files, or
  using include with a glob:
    "files": ["file1", "file2"]
    "include": ["src"]  <--- better. "everything in the src folder"
  2. How to compile it. Set the compiler options.
    "module"
    "target"
    "outDir": "lib" = the output directory.
- Now we can just run
  $ tsc
- Compiled JS file lives inside /lib. Could publish that and keep it separate
  from source code.
- Now do this, and run `tsc` again:
    "declaration": true
    "sourceMap": true
- Now we have:
1. lib/index.js - the compiled JS
2. lib/index.d.js - a type declaration file, meant to layer right on top of the
   JS that it represents. When using a TS-aware editor (like VSCode), it can
   read this, match it up with the JS code.
3. lib/index.js.map - maps breakpoints to original Typescript source
- Other compiler options:
    "jsx": "react",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "allowJs": true,
    "types": [],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "target": "es2015"


*/
