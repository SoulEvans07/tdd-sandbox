import { authManager, taskManager } from '../helpers/apiManagers';
import { CommonSequence } from '../helpers/common';

describe('socket', () => {
  const mainUser = { username: 'adam.szi', password: 'Pass123!' };
  const sameTenantUser = { username: 'andras.balogh', password: 'Pass123!' };

  beforeEach(() => {
    CommonSequence.login(mainUser.username, mainUser.password);
  });

  it('sees the task created by other user', async () => {
    const otherUser = await authManager.login(sameTenantUser);
    const newTask = await taskManager.create(
      {
        title: `New Task: ${Date.now()}`,
        tenantId: otherUser.user.tenants[0],
      },
      otherUser.token
    );

    CommonSequence.changeWorkspace('snapsoft.hu');
    cy.findByText(newTask.title).should('be.visible');
  });

  describe.only('gets real time update', () => {
    it('about other user creating task', async () => {
      CommonSequence.changeWorkspace('snapsoft.hu');

      const otherUser = await authManager.login(sameTenantUser);
      const newTask = await taskManager.create(
        {
          title: `New Task: ${Date.now()}`,
          tenantId: otherUser.user.tenants[0],
        },
        otherUser.token
      );

      cy.findByText(newTask.title).should('be.visible');
    });
  });
});
