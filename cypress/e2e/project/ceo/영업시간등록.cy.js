const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('영업시간 등록', () => {
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `${Cypress.env('StgCeo')}`,
            Type: '대리점',
            Id: `${Cypress.env('StoreTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Set Store Hours', () => {
        /* 영업시간 */
        cy.get('#operation').click();

        cy.get('#operation-store-no').select('교촌치킨(선불/KOVAN)');
        cy.get('.col-2 > .btn').click();
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

    afterEach('Status Check', function () {
        emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    });
    after('Send Email', function () {
        const { title: describeTitle, tests: allTests } = this.test.parent; // describe의 제목과 모든 테스트를 한 번에 가져오기

        emailModule.email({
            TestFails,
            describeTitle,
            EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
            TestRange:
                '영업 시간 등록' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
