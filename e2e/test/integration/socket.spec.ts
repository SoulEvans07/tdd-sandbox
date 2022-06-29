import { CommonSequence } from '../helpers/common';
import { DirectRequest } from '../helpers/directReqest';

describe('socket', () => {
  const mainUser = { username: 'adam.szi', password: 'Pass123!' };
  const sameTenantUser = { username: 'andras.balogh', password: 'Pass123!' };

  beforeEach(() => {
    CommonSequence.login(mainUser.username, mainUser.password);
  });

  test('the task created by other user is visible', async () => {
    const otherUser = await DirectRequest.login(sameTenantUser.username, sameTenantUser.password);
    const newTask = await DirectRequest.createTask(otherUser.body.token, {
      title: `New Task: ${Date.now()}`,
      tenantId: otherUser.body.user.tenants[0],
    });

    CommonSequence.changeWorkspace('snapsoft.hu');
    cy.findByText(newTask.body.title).should('be.visible');
  });

  describe.only('gets real time update', () => {
    it('about other user creating task', async () => {
      CommonSequence.changeWorkspace('snapsoft.hu');

      const otherUser = await DirectRequest.login(sameTenantUser.username, sameTenantUser.password);
      const newTask = await DirectRequest.createTask(otherUser.body.token, {
        title: `New Task: ${Date.now()}`,
        tenantId: otherUser.body.user.tenants[0],
      });

      cy.findByText(newTask.body.title).should('be.visible');
    });
  });
});
