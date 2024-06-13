export type EventHandlerController<
  EventType extends Record<string, string>,
  Event,
  EventResponse,
> = {
  [Key in keyof EventType as `handle${Key & string}`]: (
    payload: Extract<Event, { _type: EventType[Key] }>,
  ) => Promise<
    Extract<EventResponse, { _type: EventType[Key] }> extends never
      ? void
      : Extract<EventResponse, { _type: EventType[Key] }>
  >;
};
