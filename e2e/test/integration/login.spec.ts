import { screenshot } from 'helpers/common';
import { CommonSequence } from '../helpers/commonSeq';

describe('auth', () => {
  it('can login with test user', () => {
    const username = 'adam.szi';
    const password = 'Pass123!';

    CommonSequence.login(username, password);

    cy.findByRole('heading', { name: /todo/i }).should('be.visible');
    cy.get(`.profile[title="${username}"]`).should('be.visible');
    screenshot();
  });
});
