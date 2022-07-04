import { screenshot } from 'helpers/common';
import { CommonSequence } from '../helpers/commonSeq';
import { DirectRequest } from '../helpers/directReqest';

describe('socket', () => {
  const mainUser = { username: 'adam.szi', password: 'Pass123!' };
  const sameTenantUser = { username: 'andras.balogh', password: 'Pass123!' };

  beforeEach(() => {
    CommonSequence.login(mainUser.username, mainUser.password);
  });

  it('the task created by other user is visible', () => {
    DirectRequest.login(sameTenantUser.username, sameTenantUser.password).then(otherUser => {
      DirectRequest.createTask(otherUser.body.token, {
        title: `New Task: ${Date.now()}`,
        tenantId: otherUser.body.user.tenants[0],
      }).then(newTask => {
        CommonSequence.changeWorkspace('snapsoft.hu', () => {
          cy.findByText(newTask.body.title).should('be.visible');
          screenshot('1');
        });
      });
    });
  });

  describe('gets real time update', () => {
    it('about other user creating task', () => {
      CommonSequence.changeWorkspace('snapsoft.hu', () => {
        DirectRequest.login(sameTenantUser.username, sameTenantUser.password).then(otherUser => {
          DirectRequest.createTask(otherUser.body.token, {
            title: `New Task: ${Date.now()}`,
            tenantId: otherUser.body.user.tenants[0],
          }).then(newTask => {
            cy.log('other user', otherUser);
            cy.findByText(newTask.body.title).should('be.visible');
            screenshot('2');
          });
        });
      });
    });
  });
});
