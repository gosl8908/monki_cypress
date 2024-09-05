const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('Test', () => {
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
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId')[1]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Test', () => {
        cy.contains('단골맛집');
    });

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '1. 사장님 페이지 로그인',
            Screenshots,
        });
    });
});
