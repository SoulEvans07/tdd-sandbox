export class CommonSequence {
  static login(username: string, password: string) {
    cy.visit('/login');

    cy.findByRole('textbox', { name: /username/i }).type(username);
    cy.findByRole('textbox', { name: /password/i }).type(password);

    cy.findByRole('button', { name: /sign in/i }).click();

    cy.findByRole('heading', { name: /todo/i }).should('be.visible');
    cy.get(`.profile[title="${username}"]`).should('be.visible');
  }

  static changeWorkspace(workspaceName: string, callback?: () => void) {
    cy.findByTestId('user-profile')
      .click()
      .then(() => {
        cy.findByRole('option', { name: workspaceName })
          .click()
          .then(() => {
            cy.findByRole('option', { name: workspaceName, hidden: true })
              .should('have.attr', 'aria-selected')
              .and('eq', 'true');

            if (callback) {
              callback();
            }
          });
      });
  }
}
