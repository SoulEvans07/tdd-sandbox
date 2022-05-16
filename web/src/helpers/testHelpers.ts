export function supressErrorMessages() {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });
  afterAll(() => spy.mockRestore());
}
