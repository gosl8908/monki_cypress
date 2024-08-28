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
            Site: `${Cypress.env('StgCeo')}`,
            Type: '사장님',
            Id: `${Cypress.env('CeoTestId2')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 영업시간 */
        cy.get('#operation').click();
        /* 평일 */
        cy.get(':nth-child(1) > .p-0 > :nth-child(1) > .card-header > .btn').click();
        cy.get(':nth-child(2) > :nth-child(1) > .form-select').select('오전 0시');
        cy.get(':nth-child(2) > :nth-child(2) > .form-select').select('0분');
        cy.get(':nth-child(2) > :nth-child(4) > .form-select').select('오후 11시');
        cy.get(':nth-child(2) > :nth-child(5) > .form-select').select('30분');
        /* 주말 */
        cy.get(':nth-child(4) > :nth-child(1) > .form-select').select('오전 0시');
        cy.get(':nth-child(4) > :nth-child(2) > .form-select').select('0분');
        cy.get(':nth-child(4) > :nth-child(4) > .form-select').select('오후 11시');
        cy.get(':nth-child(4) > :nth-child(5) > .form-select').select('30분');
        cy.get('#vueTimeContainer > .modal-dialog > .modal-content > .modal-footer > .d-flex > :nth-child(1)').click(); // 모든 솔루션 적용
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click(); // 확인

        /* 정기휴무일 */
        cy.get(':nth-child(2) > .p-0 > .card > .card-header > .btn').click();
        cy.get(
            '#vueCloseContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(1) > .form-select',
        ).select('매월 첫째'); // 매월 첫째
        cy.get(
            '#vueCloseContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(2) > .form-select',
        ).select('일요일'); // 일요일
        cy.get('#vueCloseContainer > .modal-dialog > .modal-content > .modal-footer > .bg-gradient-primary').click(); // 적용
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click(); // 확인

        /* 휴게시간 */
        cy.get(':nth-child(4) > .p-0 > :nth-child(1) > .card-header > .btn').click();
        cy.get(
            '#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(1) > .form-select',
        ).select('낮 12시');
        cy.get(
            '#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(2) > .form-select',
        ).select('30분');

        cy.get(
            '#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(4) > .form-select',
        ).select('오후 1시');
        cy.get(
            '#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(5) > .form-select',
        ).select('30분');

        cy.get(
            '#vueBreaktimeContainer > .modal-dialog > .modal-content > .modal-footer > .d-flex > :nth-child(1)',
        ).click(); // 모든 솔루션 적용
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click(); // 확인
    });

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '영업 시간 등록',
            Screenshots,
        });
    });
});
