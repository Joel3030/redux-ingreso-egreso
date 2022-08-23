interface UserProps {
  uid: string;
  name: string;
  email: string;
}

export class User {
  static fromFirebase({ email, uid, name }: UserProps) {
    return new User(uid, name, email);
  }

  constructor(public uid: string, public name: string, public email: string) {}
}
