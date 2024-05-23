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
        cy.get('[href="/menu/menu-group"] > .btn').click();

        /* 메뉴그룹 생성 */
        cy.get('#btnAddMenuGroup').click();
        cy.wait(1 * 1000);
        cy.get('#category_nm').type('분식');
        cy.get('.modal-footer > .btn-primary').click();
        cy.get('#vueMenuGroupMain').contains('분식');

        cy.get('#btnAddMenuGroup').click();
        cy.wait(1 * 1000);
        cy.get('#category_nm').type('일식');
        cy.get('.modal-footer > .btn-primary').click();
        cy.get('#vueMenuGroupMain').contains('일식');

        cy.get('#btnAddMenuGroup').click();
        cy.wait(1 * 1000);
        cy.get('#category_nm').type('한식');
        cy.get('.modal-footer > .btn-primary').click();
        cy.get('#vueMenuGroupMain').contains('한식');

        cy.get('#btnAddMenuGroup').click();
        cy.wait(1 * 1000);
        cy.get('#category_nm').type('양식');
        cy.get('.modal-footer > .btn-primary').click();
        cy.get('#vueMenuGroupMain').contains('양식');

        cy.get('#btnAddMenuGroup').click();
        cy.wait(1 * 1000);
        cy.get('#category_nm').type('디저트');
        cy.get('.modal-footer > .btn-primary').click();
        cy.get('#vueMenuGroupMain').contains('디저트');

        cy.get('#btnAddMenuGroup').click();
        cy.wait(1 * 1000);
        cy.get('#category_nm').type('음료');
        cy.get('.modal-footer > .btn-primary').click();
        cy.get('#vueMenuGroupMain').contains('음료');
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
