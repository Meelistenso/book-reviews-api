import { AuthEventType } from '../../constants/events';

export class ChangeKarmaEvent {
  readonly _type = AuthEventType.ChangeKarma;

  constructor(
    public readonly id: number,
    public readonly karmaDiff: number,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      karmaDiff: this.karmaDiff,
    });
  }
}

export class ChangeKarmaEventResponse {
  readonly _type = AuthEventType.ChangeKarma;

  constructor(
    public readonly id: number,
    public readonly karma: number,
  ) {}

  toString() {
    return JSON.stringify({
      id: this.id,
      karma: this.karma,
    });
  }
}
