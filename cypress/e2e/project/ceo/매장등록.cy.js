const { loginModule, emailModule, apiModule, createModule, setModule } = require('../../module/manager.module.js');

describe('매장 세팅', () => {
    let Screenshots = [];
    let TestFails = [];
    let FailureObj = { Failure: false };
    let FailedTests = [];
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `${Cypress.env('StgCeo')}`,
            Id: `${Cypress.env('monkistore')[0]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    const StoreName = '자동화매장(STG)';

    it('Store Setting', () => {
        createModule.store(Cypress.env('monkitest')[4], Cypress.env('TestPwd2'), StoreName, 'Y');
    });

    afterEach('Status Check', function () {
        emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    });
    after('Send Email', function () {
        const { title: describeTitle, tests: allTests } = this.test.parent;

        emailModule.email({
            TestFails,
            describeTitle,
            EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
            TestRange: '매장 세팅' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
