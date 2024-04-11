const { loginModule, emailModule } = require('../module/manager.module.js');

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
        loginModule.login(Cypress.env('StgCeo'), '대리점', Cypress.env('CeoId'), Cypress.env('CeoPwd'));
    });

    it('Ceo Page Test', () => {
      /* 대리점등록 */
      cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/account/partners"] > .btn').click();
      cy.get('.m-3 > .col-3 > .btn').click();
      cy.get(':nth-child(3) > .col-12 > .d-flex > :nth-child(1) > .custom-control-label').click();
      cy.get('.js-active > .multisteps-form__content > .button-row > .btn').click();
      /* 아이디 */
      cy.get('#user-id').type('test'+ Cypress.env('DateLabel'))
      cy.get('#btn-check-user-id').click(); // 중복체크
      /* 비밀번호 */
      cy.get('#user-pwd').type('test123!')
      cy.get('#chk-user-pwd').type('test123!')
    });

    afterEach('Status Check', () => {
        if (Failure) {
            const ScreenshotFileName = `Ceo Page Test ${Cypress.env('DateLabel')}`;
            cy.screenshot(ScreenshotFileName);
            if (!Cypress.platform.includes('win')) {
                const CurrentFile = f.getFileName(__filename);
                Screenshots.push(`${CurrentFile}/${ScreenshotFileName}`);
            } else {
                Screenshots.push(`${ScreenshotFileName}`);
            }
            Failure = false;
        }
    });
    after('Send Email', () => {
        const TestRange =
            '1. 사장님 페이지 로그인';
        emailModule.Email({
            TestFails: TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: TestRange,
            Screenshots: Screenshots,
        });
    });
});