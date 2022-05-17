describe('auth', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('can login with test user', () => {
    const username = 'adam.szi';
    const password = 'Pass123!';
    cy.findByRole('textbox', { name: /username/i }).type(username);
    cy.findByRole('textbox', { name: /password/i }).type(password);
    cy.findByRole('button', { name: /sign in/i }).click();

    cy.findByRole('heading', { name: /todo/i }).should('be.visible');
    cy.get(`.profile[title="${username}"]`).should('be.visible');
  });
});
