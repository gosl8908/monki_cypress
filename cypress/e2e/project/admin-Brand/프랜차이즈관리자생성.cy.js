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
        cy.get('[data-mnu="/administrators/*"] > [href="#"]').click();
        cy.get('[data-mnu="/administrators/*"] > .nav > :nth-child(2) > .nav-link > p').click();
        cy.get('#btnRegAdmin').click();
        cy.get('#admin_id').type(Cypress.env('TestId')[2]);
        cy.get('#btnChkAdminId').click();
        cy.get('#admin_pass').type(Cypress.env('AdminPwd'));
        cy.get('#admin_nm').type('강해성');
        cy.get('#admin_phone').type(Cypress.env('Phone'));
        cy.get('#admin_email').type(Cypress.env('TestEmail'));
        cy.get('#fr_kitchen_no').select('번개브랜드');
        cy.get('#frmAdmin > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
        cy.get('#global_modal_body')
            .contains('등록 하시겠습니까', { timeout: 30 * 1000 })
            .should('be.visible');
        cy.wait(3 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.get('.toast')
            .contains('등록했습니다', { timeout: 10 * 1000 })
            .should('be.visible');
        cy.get('.col-sm-12').contains(Cypress.env('TestId')[2]);

        // /* 삭제 */
        // cy.get('.col-sm-12')
        //     .find('.list-data-center.align-middle')
        //     .contains('monkitest' + Cypress.env('DateLabel'))
        //     .get('.card-body.table-responsive.p-0')
        //     .find('.list-data-center.align-middle')
        //     .find('.btn-group.btn-group-sm .btn.btn-danger')
        //     .eq(0) // 수정된 부분
        //     .click(); // 수정된 부분
        // cy.get('#global_modal_body')
        //     .contains('삭제하시겠습니까?', { timeout: 30 * 1000 })
        //     .should('be.visible');
        // cy.wait(3 * 1000);
        // cy.get('#global_modal_confirm').click();
        // cy.get('.toast')
        //     .contains('삭제했습니다', { timeout: 30 * 1000 })
        //     .should('be.visible');
    });

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        const TestRange = '1. 사장님 페이지 로그인';
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '프렌차이즈 관리자 생성',
            Screenshots,
        });
    });
});
