const { loginModule, emailModule, apiModule, createModule } = require('../../module/manager.module.js');

describe('매장등록', () => {
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
            Id: `${Cypress.env('monkistore')[0]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    const storeName = '메타매장(Prod)';

    it('Store create', () => {
        createModule.store(Cypress.env('monkifav5'), Cypress.env('TestPwd2'), storeName);

        // /* 버추얼 로그인 */
        // cy.get(':nth-child(9) > .text-sm').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();
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
            TestRange: '매장등록' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
