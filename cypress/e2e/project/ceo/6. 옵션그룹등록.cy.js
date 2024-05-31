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
            Id: `${Cypress.env('TestId3')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/option"] > .btn').click();

        /* 선택 옵션그룹 등록 */
        cy.get('.col-12 > .btn').click();
        cy.get('.col-9 > .form-control').type('추가선택');
        cy.get('#OP_002').click(); // 다중
        cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').clear().type('3');
        cy.get('#requireYn_false').click(); // 선택
        cy.get('div.col-3 > .btn').click(); // 옵션 추가
        cy.get('div.col-3 > .btn').click();
        cy.get('.ui-sortable-handle > :nth-child(2) > .text-secondary > .form-control').type('고기');
        cy.get('.ui-sortable-handle > :nth-child(3) > .text-secondary > .form-control').clear().type('3000');
        cy.get(':nth-child(2) > :nth-child(2) > .text-secondary > .form-control').type('계란');
        cy.get(':nth-child(2) > :nth-child(3) > .text-secondary > .form-control').clear().type('2000');
        cy.get(':nth-child(3) > :nth-child(2) > .text-secondary > .form-control').type('공기밥');
        cy.get(':nth-child(3) > :nth-child(3) > .text-secondary > .form-control').clear().type('1000');
        cy.get('.ms-auto').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        /* 필수 옵션그룹 등록 */
        cy.get('.col-12 > .btn').click();
        cy.get('.col-9 > .form-control').type('사이즈선택');
        cy.get('div.col-3 > .btn').click(); // 옵션 추가
        cy.get('div.col-3 > .btn').click();
        cy.get('.ui-sortable-handle > :nth-child(2) > .text-secondary > .form-control').type('기본');
        cy.get(':nth-child(2) > :nth-child(2) > .text-secondary > .form-control').type('대');
        cy.get(':nth-child(2) > :nth-child(3) > .text-secondary > .form-control').clear().type('5000');
        cy.get(':nth-child(3) > :nth-child(2) > .text-secondary > .form-control').type('특대');
        cy.get(':nth-child(3) > :nth-child(3) > .text-secondary > .form-control').clear().type('10000');
        cy.get('.ms-auto').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
    });
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
