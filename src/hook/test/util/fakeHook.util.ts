export const fakeHook = (
  url: string = 'http://domain.com/test/callback',
  events: string[] = ['*.*'],
  secret: string = undefined,
  rotate: boolean = false,
) => ({
  name: 'Test Hook',
  url,
  event: events,
  secret,
  rotate,
});
