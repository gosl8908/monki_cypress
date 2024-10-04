const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('Onprem Dashboard Test', () => {
    let TestFails = []; // 실패 원인을 저장할 변수
    let Screenshots = []; // 스크린샷을 저장할 배열
    let Failure = false;
    Cypress.on('fail', (err, runnable) => {
        const ErrMessage = err.message || '알 수 없는 이유로 실패함';
        !TestFails.includes(ErrMessage) && TestFails.push(ErrMessage);
        Failure = true;
        throw err;
    });
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        loginModule.login({
            Site: `${Cypress.env('Admin')}`,
            Id: `${Cypress.env('AdminId')}`,
            Password: `${Cypress.env('AdminPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        cy.get('.sidebar').contains('먼키캐시 관리').click();
        cy.get('.sidebar').contains('먼키캐시 지급/차감').click();
        cy.contains('등록').click();

        cy.get(':nth-child(1) > .col-sm-10 > .ml-5 > label').click();
        cy.get('.input-group > .form-control').type(Cypress.env('Phone'));
        cy.get(':nth-child(4) > .col-sm-6').contains('확인').click();
        cy.get('#title').type('테스트');
        cy.get(':nth-child(9) > .col-sm-6 > .form-control').type('100000');
        cy.get('#reason').type('테스트');

        cy.get('#frmPointAmt > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
        cy.wait(1 * 1000);
        cy.contains('span', Cypress.env('Date'))
            .parents('tr')
            .within(() => {
                cy.get('button').contains('지급/차감').click();
            });

        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
    });

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '캐시 적립',
            Screenshots,
        });
    });
});
