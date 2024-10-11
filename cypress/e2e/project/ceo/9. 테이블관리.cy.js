const { loginModule, tableModule, emailModule } = require('../../module/manager.module.js');

describe('테이블관리', () => {
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
        cy.setDateToEnv();
        cy.getAll();
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
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '테이블 관리',
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
