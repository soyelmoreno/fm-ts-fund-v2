import { HasEmail, HasPhoneNumber } from "./1-basics";

//== FUNCTIONS ==//

// (1) function arguments and return values can have type annotations
function sendEmail(to: HasEmail): { recipient: string; body: string } {
  return {
    recipient: `${to.name} <${to.email}>`, // Mike <mike@example.com>
    body: "You're pre-qualified for a loan!"
  };
}

// (2) or the arrow-function variant
const sendTextMessage = (
  to: HasPhoneNumber
): { recipient: string; body: string } => {
  return {
    recipient: `${to.name} <${to.phone}>`,
    body: "You're pre-qualified for a loan!"
  };
};

// (3) return types can almost always be inferred
function getNameParts(contact: { name: string }) {
  const parts = contact.name.split(/\s/g); // split @ whitespace
  // If you add this guard, your inferred return type is different
  // if (parts.length ===1) {
  //   return {name: parts[0]}
  // }
  if (parts.length < 2) {
    throw new Error(`Can't calculate name parts from name "${contact.name}"`);
  }
  return {
    first: parts[0],
    middle:
      parts.length === 2
        ? undefined
        : // everything except first and last
          parts.slice(1, parts.length - 2).join(" "),
    last: parts[parts.length - 1]
  };
}

// (4) rest params work just as you'd think. Type must be array-ish
const sum = (...vals: number[]) => vals.reduce((sum, x) => sum + x, 0);
console.log(sum(3, 4, 6)); // 13

// (5) we can even provide multiple function signatures
// "overload signatures"
// These are specific, valid ways to access this function
function contactPeople(method: "email", ...people: HasEmail[]): void;
function contactPeople(method: "phone", ...people: HasPhoneNumber[]): void;

// "function implementation"
// We have two ways to access this function, the specific function signatures
// (overloads) that we have defined. The signature of the function
// implementation **is not callable** from the outside. It just needs to be wide
// enough (i.e. general enough), to accomodate all of the function signatures.

// Note that it's a good idea to *not* be super general. I.e., don't make them
// `method: string` and `...people: any[]`, or remove the types completely
// (those would then be "implict any" and "implicit any[]"). To the outside
// world it would work the same, but within your function it would be the wild
// west...there would be no type safety.
function contactPeople(
  method: "email" | "phone",
  ...people: (HasEmail | HasPhoneNumber)[]
): void {
  if (method === "email") {
    (people as HasEmail[]).forEach(sendEmail);
  } else {
    (people as HasPhoneNumber[]).forEach(sendTextMessage);
  }
}
// contactPeople() //hover this

// ✅ email works
contactPeople("email", { name: "foo", email: "" });

// ✅ phone works
contactPeople("phone", { name: "foo", phone: 12345678 });

// 🚨 mixing does not work conceptually. But, unfortunately, it does work in
// Typescript. That's because, we've defined two independent and unrelated
// contraints. Both arguments can be for either email or phone. In order to
// provide the desired constraint, we need to prevent some disallowed
// combinations.
contactPeople("email", { name: "foo", phone: 12345678 });

// (6) the lexical scope (this) of a function is part of its signature

// Note: it looks like it takes two arguments, but it only one takes. The first
// part is just establishing the type that the `this` object must be within the
// function. The second part, `preferredMethod`, is the actual, solitary
// parameter.
function sendMessage(
  this: HasEmail & HasPhoneNumber,
  preferredMethod: "phone" | "email"
) {
  if (preferredMethod === "email") {
    console.log("sendEmail");
    sendEmail(this);
  } else {
    console.log("sendTextMessage");
    sendTextMessage(this);
  }
}
// Create an object that meets this constraint
const c = { name: "Mike", phone: 3215551212, email: "mike@example.com" };

function invokeSoon(cb: () => any, timeout: number) {
  // Sort of contrived, but let's deliberately set `this` to `null`
  setTimeout(() => cb.call(null), timeout);
}

// 🚨 this is not satisfied
invokeSoon(() => sendMessage("email"), 500);

// Can solve this two ways:
// 1. ✅ creating a bound function is one solution
const bound = sendMessage.bind(c, "email");
invokeSoon(() => bound(), 500);

// 2. ✅ call/apply works as well
invokeSoon(() => sendMessage.apply(c, ["phone"]), 500);

export default {};
