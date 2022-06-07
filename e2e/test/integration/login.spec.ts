import { CommonSequence } from '../helpers/common';
import { DirectRequest } from '../helpers/directReqest';

describe('auth', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('can login with test user', async () => {
    const username = 'adam.szi';
    const password = 'Pass123!';
    CommonSequence.login(username, password);
  });
});
