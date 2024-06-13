import { text } from 'express';
import { ModerationEventType } from '../../constants/events';

export class CheckTextEvent {
  readonly _type = ModerationEventType.CheckText;

  constructor(public readonly text: string) {}

  toString() {
    return JSON.stringify({ text });
  }
}

export class CheckTextEventResponse {
  readonly _type = ModerationEventType.CheckText;

  constructor(public readonly isAcceptable: boolean) {}

  toString() {
    return JSON.stringify({
      isAcceptable: this.isAcceptable,
    });
  }
}
