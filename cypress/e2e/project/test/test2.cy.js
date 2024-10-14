const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('Test', () => {
    let TestFails = []; // 실패 원인을 저장할 변수
    let Screenshots = []; // 스크린샷을 저장할 배열
    let Failure = false;
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열

    Cypress.on('fail', (err, runnable) => {
        const ErrMessage = err.message || '알 수 없는 이유로 실패함';
        if (!TestFails.includes(ErrMessage)) {
            TestFails.push(ErrMessage);
            FailedTests.push(runnable.title); // 실패한 테스트의 타이틀을 저장
        }
        Failure = true;
        throw err;
    });
    beforeEach(() => {
        Failure = false;
        cy.setDateToEnv();
        cy.getAll();
        loginModule.login({
            Site: `${Cypress.env('Ceo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Pass1', () => {
        cy.contains('단골맛집', { timeout: 1 * 1000 });
    });
    it('Fail1', () => {
        cy.contains('345', { timeout: 1 * 1000 });
    });
    it('Pass2', () => {
        cy.contains('단골맛집', { timeout: 1 * 1000 });
    });
    it('Fail2', () => {
        cy.contains('678', { timeout: 1 * 1000 });
    });

    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
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
