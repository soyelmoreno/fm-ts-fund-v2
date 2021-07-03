import { HasPhoneNumber, HasEmail } from "./1-basics";

// == CLASSES == //

/**
 * (1) Classes work similarly to what you're used to seeing in JS
 * -   They can "implement" interfaces
 */

export class Contact implements HasEmail {
  email: string;
  name: string;
  constructor(name: string, email: string) {
    this.email = email;
    this.name = name;
  }
}

/**
 * (2) This looks a little verbose -- we have to specify the words "name" and "email" 3x.
 * -   Typescript has a shortcut: PARAMETER PROPERTIES
 */

/**
 * (3) Access modifier keywords - "who can access this thing"
 *
 * - public - everyone
 * - protected - me and subclasses
 * - private - only me
 */

class ParamPropContact implements HasEmail {
  constructor(
    public name: string,
    // protected email: string = "no email") {
    // Can give it a default just like a function argument
    public email: string = "no email"
  ) {
    // nothing needed
  }
}
const x = new ParamPropContact("a", "b");
// If email set to `protected, then only name is available on x
// But then ParamPropContact does not conform to HasEmail interface because
// email field is no longer public.

/**
 * (4) Class fields can have initializers (defaults)
 */
class OtherContact implements HasEmail, HasPhoneNumber {
  // Can give it a default value! But only if not initialized in the constructor
  protected age: number = 0;
  // Hey look, can also do readonly. Will yell at you when you attempt to write
  // to this property. But! Be advised that not everyone uses type information.
  // Some user could consume this class and write to this property. Just a check
  // while you're coding.

  // readonly age: number = 0;

  private password: string;
  constructor(
    public name: string,
    //
    public email: string,
    //
    public phone: number
  ) {
    // () password must either be initialized like this, or have a default value
    this.password = Math.round(Math.random() * 1e14).toString(32);

    // Could also do 
    private password: string | undefined
    // Which would force consumers to do a guard
    if (this.password) {
      this.password;
    }

    // But wait, we might need to call an async function that goes and sets the
    // value upon initialization.
    async init() {
      this.password = Math.round(Math.random() * 1e14).toString(32);
    }

    // In this case, we know more than Typescript. So we can use the "definite
    // assignment operator", the ! symbol, after the variable. This tells
    // Typescript: "trust me, Typescript, I'm taking responsibility for making
    // sure that this field gets initialized properly. So let me handle this,
    // and don't cause an error at this point in the code." E.g., the first task
    // in a lifecycle hook is to go get the password. This simplifies code,
    // because you can just trust that it will be there. 
    private password!: string;

    // Also, maybe password won't be there until later. Do this:
    private passwordVal: string | undefined;
    // ES5 getter
    get password(): string {
      if (!passwordVal) {
        this.passwordVal = Math.round(Math.random() * 1e14).toString(32);
      }
      return this.passwordVal;
    }
  }


}

/**
 * (5) TypeScript even allows for abstract classes, which have a partial implementation
 */

abstract class AbstractContact implements HasEmail, HasPhoneNumber {
  public abstract phone: number; // must be implemented by non-abstract subclasses

  constructor(
    public name: string,
    public email: string // must be public to satisfy HasEmail
  ) {}

  abstract sendEmail(): void; // must be implemented by non-abstract subclasses
}

/**
 * (6) implementors must "fill in" any abstract methods or properties
 */
class ConcreteContact extends AbstractContact {
  constructor(
    public phone: number, // must happen before non property-parameter arguments
    name: string,
    email: string
  ) {
    super(name, email);
  }
  sendEmail() {
    // mandatory!
    console.log("sending an email");
  }
}
