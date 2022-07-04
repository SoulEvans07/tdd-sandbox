type ScreenshotOptions = typeof cy.screenshot extends (fileName: string, options: infer R) => any ? R : never;

const screenshotOpt: Partial<ScreenshotOptions> = { capture: 'runner' };

export function screenshot(fileName?: string, i?: number) {
  const index = i !== undefined ? `${i}. ` : '';
  if (fileName) cy.screenshot(index + fileName, screenshotOpt);
  else cy.screenshot(screenshotOpt);
}
