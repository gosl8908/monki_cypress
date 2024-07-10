const { loginModule, tableModule, emailModule } = require('../../module/manager.module.js');

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
            Type: '대리점',
            Id: `${Cypress.env('StoreTestId1')}`,
            Password: `${Cypress.env('AdminPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 테이블관리 */
        cy.get('#operation').click();
        cy.get('[href="/store/table-order/basic"] > .btn').click();
        cy.get('#tableinfo').click();
        cy.get('#basic-store-no').select('번개매장 안양지점');
        cy.get('.col-2 > .btn').click(); // 검색

        // /* 테이블변경 */
        // cy.get(
        //     '#divGroundResourceTableView_0 > :nth-child(1) > .height-200 > .text-center > :nth-child(1) > #btnTableEdit_0',
        // ).click();
        // cy.get('#add_resource_name').clear().type('1-1번');
        // cy.get('#btnTableNameOverCheck').click();
        // cy.get(
        //     '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        // ).click();

        // /* 구역 수정 */
        // cy.get('#btnGroupEdit_0').click();
        // cy.get('#add_ground_name').clear().type('1층');
        // cy.get(
        //     '#modalGroupRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        // ).click();

        tableModule.table('1층', '1-1');
        tableModule.table('1층', '1-2');
        tableModule.table('1층', '1-3');

        // tableModule.ground('2층', '2');
        tableModule.table('2층', '2-1');
        tableModule.table('2층', '2-2');
        tableModule.table('2층', '2-3');
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
