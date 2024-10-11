const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('Test', () => {
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
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Test1', () => {
        cy.contains('단골맛집', { timeout: 1 * 1000 });

        cy.get('[href="/sales/monki/main"] > .btn').click();

        cy.get('#container').contains('전체매출 현황').should('be.visible');

        cy.get('[href="/sales/renew/monkiapp"] > .btn').click();
        cy.get('#container').contains('앱 일자/기간별 매출 현황').should('be.visible');

        cy.get('[href="/sales/renew/tableorder"] > .btn').click();
        cy.get('#container').contains('후불결제 사용 매장은 POS에서 매출 확인이 가능합니다.').should('be.visible');
    });
    // it('Test2', () => {
    //     cy.contains('345', { timeout: 1 * 1000 });
    // });
    // it('Test3', () => {
    //     cy.contains('678', { timeout: 1 * 1000 });
    // });

    afterEach('Status Check', function () {
        emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '1. 테스트',
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
