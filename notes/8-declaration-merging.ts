/**
 * (1) "identifiers" (i.e., a variable, class, function, interface) can be
 * associated with three things: value, type and namespace
 */

import { ForOfStatement } from "typescript";

function foo() {}
interface bar {}
namespace baz {
  export const biz = "hello";
}

// a namespace is kind of like an object. Just a collection of stuff merged
// together. Could do:
baz.biz;

// how to test for a value: Should be able to assign it to an identifier. Works
// for foo (because it is a value):
const x = foo; // foo is in the value position (RHS).
// Try it with the interface:
const n = bar; // Nope: "'bar' only refers to a type, but is being used as a value here."

// how to test for a type: try to use it as a type. If you can do that
// successfully, then it can be regarded as a type. Can do bar:
const y: bar = {}; // bar is in the type position (LHS).
// Cannot do foo:
const b: foo = {}; //'foo' refers to a value, but is being used as a type here. Did you mean 'typeof foo'?
let c: foo;

// how to test for a namespace: must rely on tooltips for that (hover over baz symbol)
baz;

export { foo, bar, baz }; // all are importable/exportable

/**
 * (2) Functions and variables are purely values.
 * -   Their types may only be extracted using type queries
 */
const xx = 4;
const yy: typeof xx = 4; // <---- "typeof" is a type query

/**
 * (3) Interfaces are purely types
 */
interface Address {
  street: string;
}

const z = Address; // 🚨 ERROR (fails value test)

/**
 * (4) Classes are both types _and_ values!
 */

class Contact {
  name: string;
  static hello = "world";
}

// passes both the value and type tests! Whaaaaaa?
Contact.hello;
const contactClass = Contact; // value relates to the factory for creating instances
// But when used as a type it can be used to describe the instances themselves,
// almost like an interface:
const contactInstance: Contact = new Contact(); // interface relates to instances

/**
 * (5) When declarations have the same name, they can be merged, to occupy the
 * same identifier
 * - So if you arrange things just the right way, mainly, you don't have values
 *   that collide with other values, you can end up with a big crazy thing: a
 *   value, an interface, and a namespace, all stacked up on top of each other,
 *   all riding the same identifier (symbol).
 */

class Album {
  label: Album.AlbumLabel = new Album.AlbumLabel();
}
namespace Album {
  export class AlbumLabel {}
}
interface Album {
  artist: string;
}

let al: Album; // type test
let al2 = new Album();
al2.artist; // from the interface
al2.label; // from the class

let alValue = Album; // value test

export { Album }; // 👈 hover over the "Album" -- all three slots filled

/**
 * (6) Namespaces have their own slot, and are also values
 */

// 💡 they can be merged with classes

class AddressBook {
  contacts!: Contact[];
}
namespace AddressBook {
  export class ABContact extends Contact {} // "inner class"
}

const ab = new AddressBook();
ab.contacts.push(new AddressBook.ABContact());

// 💡 they can also be merged with functions

function format(amt: number) {
  return `${format.currency}${amt.toFixed(2)}`;
}
namespace format {
  export const currency: string = "$ ";
}

format(2.314); // $ 2.31
format.currency; // $

// Takeaway: knowing what's a type, and knowing what's a value...will take you a
// long way. And knowing what can be augmented (interfaces), vs knowing what you
// kind of have to leave alone when they're defined in types (values).
