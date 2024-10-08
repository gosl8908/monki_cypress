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
        Failure = false; // Failure 변수를 false로 초기화
        cy.setDateToEnv();
        cy.getAll();
        loginModule.login({
            Site: `${Cypress.env('Ceo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Test1', () => {
        cy.contains('123123123', { timeout: 1 * 1000 });
    });
    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
        // const f = {
        //     getFileName: filePath => {
        //         return filePath.split('/').pop(); // 파일 경로에서 파일명만 추출
        //     },
        // };
        // if (Failure) {
        //     const ScreenshotFileName = `${Cypress.env('DateLabel')}_${this.currentTest.title}`;
        //     cy.screenshot(ScreenshotFileName, { capture: 'fullPage' });

        //     // 플랫폼별 경로 차이 없이 단순하게 파일 이름만 추가
        //     Screenshots.push(ScreenshotFileName);

        //     Failure = false;
        // }
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '1. 테스트',
            Screenshots,
        });
    });
});
