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
            Id: `monkitest1`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        /* 분식 메뉴그룹 관리 */
        cy.get(':nth-child(3) > :nth-child(5) > .btn').click();
        // cy.get('tr > :nth-child(1) > .btn').click();
        cy.get('.all-menu-list').find('.btn[title="김밥"]').click();
        // cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();

        // /* 먼키앱메뉴 등록*/
        // cy.get('[href="/menu/app"] > .btn').click();
        // cy.get(':nth-child(1) > :nth-child(12) > .btn').click();
        // cy.wait(1 * 1000);
        // cy.get('#bestMenuYn_true').click();
        // cy.get('#MN_001').click();
        // cy.get('.ms-auto').click();
        // cy.wait(1 * 1000);
        // cy.get('#global_modal_confirm').click();

        // /* 테이블오더메뉴 등록*/
        // cy.get('[href="/menu/table-order"] > .btn').click();
        // cy.get(':nth-child(1) > :nth-child(12) > .btn').click();
        // cy.wait(1 * 1000);
        // cy.get('#bestMenuYn_true').click();
        // cy.get('#MN_001').click();
        // cy.get('.ms-auto').click();
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
