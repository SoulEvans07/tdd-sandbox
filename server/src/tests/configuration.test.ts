describe('Configuration', () => {
  test.each`
    config                       | value
    ${process.env.PORT}          | ${'3001'}
    ${process.env.JWT_TOKEN_KEY} | ${'gMHW2GKPNJVEjudyFF2UJ31GT5y2f17R019ryHdrOnxTjtRblKll7tq3Eur3pEOlx1iotKzxbe6dFR1S'}
    ${process.env.DB_NAME}       | ${'todododooo'}
    ${process.env.DB_USER}       | ${'todo-user'}
    ${process.env.DB_PASSWORD}   | ${'todo-password'}
    ${process.env.DB_SOURCE}     | ${':memory:'}
    ${process.env.DB_LOGGER}     | ${'false'}
    ${process.env.LOGGER}        | ${'false'}
  `('get config value $config for config $config', async ({ config, value }: { config: string; value: any }) => {
    expect(config).toBe(value);
  });
});
