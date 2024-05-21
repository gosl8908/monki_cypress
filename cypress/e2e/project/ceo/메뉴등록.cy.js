const { loginModule, emailModule, menuModule } = require('../../module/manager.module.js');

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
        loginModule.login({
            Site: `${Cypress.env('StgCeo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('TestId2')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('#product').click(); // 상품관리 탭

        /* 분식 */
        menuModule.menu('김밥', '2500');
        menuModule.menu('참치김밥', '4500');
        menuModule.menu('쫄면', '5500');
        menuModule.menu('고기국수', '6500');
        menuModule.menu('비빔면', '6500');
        menuModule.menu('골뱅이무침', '9500');
        /* 한식 */
        menuModule.menu('비빔밥', '6500');
        menuModule.menu('불고기', '9500');
        /* 일식 */
        menuModule.menu('초밥', '10500');
        menuModule.menu('돈가스', '8000');
        menuModule.menu('치즈돈가스', '9500');
        /* 디저트 */
        menuModule.menu('디저트', '3500');
        menuModule.menu('샐러드', '8500');
        /* 양식 */
        menuModule.menu('피자', '19900');
        /* 음료 */
        menuModule.menu('코카콜라', '2500');
        menuModule.menu('코카콜라제로', '2500');
        menuModule.menu('펩시', '2500');
        menuModule.menu('펩시제로', '2500');
        menuModule.menu('스프라이트', '2500');
        menuModule.menu('스프라이트제로', '2500');
        /* 주류 */
        menuModule.menu('새로', '6000');
        menuModule.menu('진로', '6000');
        menuModule.menu('카스', '6000');
        menuModule.menu('테라', '6000');
    });

    // afterEach('Status Check', () => {
    //     if (Failure) {
    //         const ScreenshotFileName = `Ceo Page Test ${Cypress.env('DateLabel')}`;
    //         cy.screenshot(ScreenshotFileName);
    //         if (!Cypress.platform.includes('win')) {
    //             const CurrentFile = f.getFileName(__filename);
    //             Screenshots.push(`${CurrentFile}/${ScreenshotFileName}`);
    //         } else {
    //             Screenshots.push(`${ScreenshotFileName}`);
    //         }
    //         Failure = false;
    //     }
    // });
    // after('Send Email', () => {
    //     const TestRange =
    //         '1. 사장님 페이지 로그인';
    //     emailModule.email({
    //         TestFails: TestFails,
    //         EmailTitle: `[${Cypress.env('EmailTitle')}]`,
    //         TestRange: TestRange,
    //         Screenshots: Screenshots,
    //     });
    // });
});
