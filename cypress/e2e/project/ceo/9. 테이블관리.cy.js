const { loginModule, tableModule, emailModule } = require('../../module/manager.module.js');

describe('테이블관리', () => {
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `${Cypress.env('Ceo')}`,
            Type: '대리점',
            Id: `${Cypress.env('StoreTestId')[2]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 테이블관리 */
        cy.get('#operation').click();
        cy.get('[href="/store/table-order/basic"] > .btn').click();
        cy.get('#tableinfo').click();
        cy.get('#basic-store-no').select('교촌치킨(선불)');
        cy.get('.col-2 > .btn').click(); // 검색

        tableModule.table('2층', '50');
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
            TestRange: '테이블 관리' + `\n${allTests.map(test => `${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
