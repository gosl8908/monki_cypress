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

        menuModule.menuGroup('분식');
        cy.wait(1 * 1000);
        menuModule.menuAdd('김밥');
        menuModule.menuAdd('라면');
        menuModule.menuAdd('쫄면');

        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        menuModule.menuGroup('일식');
        cy.wait(1 * 1000);
        menuModule.menuAdd('돈가스');
        menuModule.menuAdd('치즈돈가스');

        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        menuModule.menuGroup('한식');
        cy.wait(1 * 1000);
        menuModule.menuAdd('비빔면');

        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        menuModule.menuGroup('양식');
        cy.wait(1 * 1000);
        menuModule.menuAdd('피자');

        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        menuModule.menuGroup('음료');
        cy.wait(1 * 1000);
        menuModule.menuAdd('코카콜라');
        menuModule.menuAdd('코카콜라제로');
        menuModule.menuAdd('펩시');
        menuModule.menuAdd('펩시제로');
        menuModule.menuAdd('스프라이트');
        menuModule.menuAdd('스프라이트제로');

        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        menuModule.menuGroup('주류');
        cy.wait(1 * 1000);
        menuModule.menuAdd('새로');
        menuModule.menuAdd('진로');
        menuModule.menuAdd('카스');
        menuModule.menuAdd('테라');

        cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
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
