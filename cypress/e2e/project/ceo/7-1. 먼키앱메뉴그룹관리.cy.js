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
            Site: `${Cypress.env('Ceo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId1')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        const menuGroups = {
            분식: ['라면', '김밥', '참치김밥', '쫄면', '고기국수', '비빔면', '골뱅이무침'],
            한식: ['비빔밥', '불고기'],
            일식: ['돈가스', '치즈돈가스', '초밥'],
            디저트: ['케익', '샐러드'],
            양식: ['피자'],
            음료: ['코카콜라', '코카콜라제로', '펩시', '펩시제로', '스프라이트', '스프라이트제로'],
        };

        Object.entries(menuGroups).forEach(([group, items]) => {
            menuModule.menuGroup(group, 'App');
            cy.wait(1000);

            items.forEach(item => {
                menuModule.menuAdd(item);
            });

            cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            cy.wait(1000);
            cy.get('#global_modal_confirm').click();
        });

        // /* 분식 */
        // menuModule.menuGroup('분식', 'App');
        // cy.wait(1 * 1000);
        // menuModule.menuAdd('라면');
        // menuModule.menuAdd('김밥');
        // menuModule.menuAdd('참치김밥');
        // menuModule.menuAdd('쫄면');
        // menuModule.menuAdd('고기국수');
        // menuModule.menuAdd('비빔면');
        // menuModule.menuAdd('골뱅이무침');

        // cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();

        // /* 한식 */
        // menuModule.menuGroup('한식', 'App');
        // cy.wait(1 * 1000);
        // menuModule.menuAdd('비빔밥');
        // menuModule.menuAdd('불고기');

        // cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();

        // /* 일식 */
        // menuModule.menuGroup('일식', 'App');
        // cy.wait(1 * 1000);
        // menuModule.menuAdd('돈가스');
        // menuModule.menuAdd('치즈돈가스');
        // menuModule.menuAdd('초밥');

        // cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();

        // /* 디저트 */
        // menuModule.menuGroup('디저트', 'App');
        // cy.wait(1 * 1000);
        // menuModule.menuAdd('케익');
        // menuModule.menuAdd('샐러드');

        // cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();

        // /* 양식 */
        // menuModule.menuGroup('양식', 'App');
        // cy.wait(1 * 1000);
        // menuModule.menuAdd('피자');

        // cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();

        // /* 음료 */
        // menuModule.menuGroup('음료', 'App');
        // cy.wait(1 * 1000);
        // menuModule.menuAdd('코카콜라');
        // menuModule.menuAdd('코카콜라제로');
        // menuModule.menuAdd('펩시');
        // menuModule.menuAdd('펩시제로');
        // menuModule.menuAdd('스프라이트');
        // menuModule.menuAdd('스프라이트제로');

        // cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();
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
