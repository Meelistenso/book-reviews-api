import { BookEventType } from '../../constants/events';

export class SynchronizeSearchIndexEvent {
  readonly _type = BookEventType.SynchronizeSearchIndex;

  constructor() {}

  toString() {
    return JSON.stringify({});
  }
}

export class SynchronizeSearchIndexEventResponse {
  readonly _type = BookEventType.SynchronizeSearchIndex;

  constructor(public readonly indexSize?: number) {}

  toString() {
    return JSON.stringify({ indexSize: this.indexSize });
  }
}
