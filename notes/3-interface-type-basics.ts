import { HasPhoneNumber, HasEmail } from "./1-basics";

//== TYPE ALIAS ==//
/**
 * (1) Type aliases allow us to give a type a name
 */
type StringOrNumber = string | number;

// // this is the ONLY time you'll see a type on the RHS of assignment
type HasName = { name: string };

// 🚨 self-referencing types don't work! (we'll get there!)
const x = [1, 2, 3, 1, 1, [3, 2, 1, 2]];
type NumVal = 1 | 2 | 3 | NumArr;
type NumArr = NumVal[];

// okay, punchline is: we could make NumArr an interface instead of a type, and
// then it can be referred to when defining NumVal. Like this:
// interface NumArr extends Array<NumVal> {}

// == INTERFACE == //
/**
 * (2) Interfaces can extend from other interfaces
 */

// Remember that "extends" is used for inheritance of "like" things. Interfaces
// extend from interfaces. Classes extend from classes. Here we're just adding
// country code to something that already has a phone number and a name.
export interface HasInternationalPhoneNumber extends HasPhoneNumber {
  countryCode: string;
}

/**
 * (3) they can also be used to describe call signatures
 */

// Note that interfaces can only handle JS object-type entities, e.g. objects,
// arrays, functions, Sets (things that have prototypes). But they cannot handle
// the primitives like string, number, boolean. Types are more flexible; they
// can handle the primitives and the object-type things.

// So here's a function signature. Syntax for return type is `: void` after the
// parens
interface ContactMessenger1 {
  (contact: HasEmail | HasPhoneNumber, message: string): void;
}

// And here's the equivalent with a type. Syntax for return type is `fat arrow
// void` after the parens. This gives us a function type with a type alias.
type ContactMessenger2 = (
  contact: HasEmail | HasPhoneNumber,
  message: string
) => void;

// NOTE: we don't need type annotations for contact or message. It comes along
// withe function type alias
const emailer: ContactMessenger1 = (_contact, _message) => {
  /** ... */
};

/**
 * (4) construct signatures can be described as well.
 */

// Contruct signatures look very similar to call signatures. All you need is
// `new` ahead of it.
interface ContactConstructor {
  new (...args: any[]): HasEmail | HasPhoneNumber;
}

/**
 * (5) index signatures describe how a type will respond to property access
 */

/**
 * @example
 * This is how we would do a dictionary as an object
 * {
 *    iPhone: { areaCode: 123, num: 4567890 },
 *    home:   { areaCode: 123, num: 8904567 },
 * }
 */

// Here's how we would do a dictionary as an array.
interface PhoneNumberDict {
  // arr[0],  foo['myProp']
  [numberName: string]: // <=== I think this is the "index signature"
    | undefined
    | {
        areaCode: number;
        num: number;
      };
}

// This index signature states that when a PhoneNumberDict is indexed with a
// string, it will return either undefined or an object with this shape.

// Now let's create an instance of interface PhoneNumberDict

// Need to include the case where it returns `undefined`. Else, if given a key
// that doesn't exist, it doesn't let you know.
const d: PhoneNumberDict = {};
d.abc // <=== if you don't add undefined, this won't error, when it should!
// If you add the undefined, it forces you to check if it exists, like this
if (d.abc) { // hover and the undefined is present
  d.abc; // hover and the undefined has disappeared. We have narrowed the type.
}

// Conditions can be used to narrow types. Could do it like this as well:
if (typeof d.abc === 'object') {
  d.abc; // Hover shows the object shape
  // If you change that to typeof d.abc === 'string', then hover shows d.abc is
  // a "never". As in, never gonna happen. Narrowed all the way down.
}

// Let's create another instance
const phoneDict: PhoneNumberDict = {
  office: { areaCode: 321, num: 5551212 },
  home: { areaCode: 321, num: 5550010 } // try editing me
};

// at most, a type may have one string and one number index signature

/**
 * (6) We can use index signatures in combination with other types
 */

// augment the existing PhoneNumberDict
// i.e., imported it from a library, adding stuff to it
interface PhoneNumberDict {
  home: {
    /**
     * (7) interfaces are "open", meaning any declarations of the
     * -   same name are merged
     */
    areaCode: number;
    num: number;
  };
  office: {
    areaCode: number;
    num: number;
  };
}

phoneDict.home;   // definitely present
phoneDict.office; // definitely present
phoneDict.mobile; // MAYBE present

// So what we're seeing here:
// - declaration merging
// - we can stack indexes on top of other things

// == TYPE ALIASES vs INTERFACES == //

// Interfaces are kind of like functions. They are parsed like functions, in
// that, we know that an interface exists and it has a particular name as we go
// through and parse things (it's hoisted! just like a function. We can refer to
// it before it is defined). But only when we attempt to actually access it and
// use it will we figure out what are the allowable types for this thing.

// - Type aliases: are sorted out eagerly. Extremely flexible, can give a name
//   to any type
// - Interfaces: are sorted out lazily. Use for things that are objects or
//   sub-types of object in the Javascript sense (objects, arrays, functions,
//   Sets, Maps, Date, etc.)

/**
 * (7) Type aliases are initialized synchronously, so self-referential stuff is 👎
 */

type NumberVal = 1 | 2 | 3 | NumberArr;
type NumberArr = NumberVal[];

/**
 * (8) Interfaces are initialized lazily, so combining it
 * -   w/ a type alias allows for recursive types!
 */

type StringVal = "a" | "b" | "c" | StringArr;

// type StringArr = StringVal[];
interface StringArr {
  // arr[0]
  [k: number]: "a" | "b" | "c" | StringVal[];
}

const x: StringVal = Math.random() > 0.5 ? "b" : ["a"]; // ✅ ok!

export default {};
