export interface Event<T> {
  eventId: string;
  event: string;
  timestamp: string;
  data: T;
}
