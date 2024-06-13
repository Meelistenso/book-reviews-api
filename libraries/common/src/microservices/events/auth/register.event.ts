import { AuthEventType } from 'libraries/common/src/microservices/constants/events';

export class RegisterEvent {
  readonly _type = AuthEventType.Register;

  constructor(
    public readonly uid: string,
    public readonly email: string,
    public readonly displayName?: string,
    public readonly photoURL?: string,
    public readonly phoneNumber?: string,
  ) {}

  toString() {
    return JSON.stringify({
      uid: this.uid,
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      phoneNumber: this.phoneNumber,
    });
  }
}
