import { waitFor } from '@testing-library/react';

export function supressErrorMessages() {
  let spy: jest.SpyInstance;
  beforeEach(() => {
    spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
  });
  afterEach(() => spy.mockRestore());
}

export async function waitForMillis(ms: number) {
  return await waitFor(
    async () => {
      await new Promise(res => setTimeout(res, ms));
      expect(true).toBe(true);
    },
    { timeout: ms + 100 }
  );
}
