export const passObj = (message: () => string) => ({ pass: true, message });
export const failObj = (message: () => string) => ({ pass: false, message });
