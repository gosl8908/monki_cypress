const { loginModule, emailModule } = require('../../module/manager.module.js');

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
            Type: '대리점',
            Id: `${Cypress.env('TestId')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 테이블관리 */
        cy.get('#operation-tab').click();
        cy.get('[href="/store/table-order/basic"] > .btn').click();
        cy.get('#tableinfo').click();
        cy.get('.col-2 > .btn').click(); // 검색

        /* 테이블변경 */
        cy.get(
            '#divGroundResourceTableView_0 > :nth-child(1) > .height-200 > .text-center > :nth-child(1) > #btnTableEdit_0',
        ).click();
        cy.get('#add_resource_name').clear.type('1-1번');
        cy.get('#btnTableNameOverCheck').click();
        cy.get(
            '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        ).click();

        /* 구역 수정 */
        cy.get('#btnGroupEdit_0').click();
        cy.get('#add_ground_name').clear.type('1층');
        cy.get(
            '#modalGroupRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        ).click();

        /* 1층 테이블추가 */
        cy.get('#divGroundResourceTableView_0 > .text-center.border > .tableorder-center-text > a').click();
        cy.get('#add_resource_name').type('1-2번');
        cy.get('#btnTableNameOverCheck').click();
        cy.get(
            '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        ).click();

        /* 2층 구역추가 */
        cy.get('#btnSerialAdd').click();
        cy.get('#add_ground_name').type('2층');
        cy.get(
            '#modalGroupRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        ).click();

        /* 2층 테이블추가 */
        cy.get('#btnGroupEdit_0').click();
        cy.get('#divGroundResourceTableView_1 > .text-center.border > .tableorder-center-text > a').click();
        cy.get('#add_resource_name').type('2-1번');
        cy.get('#btnTableNameOverCheck').click();
        cy.get(
            '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        ).click();

        cy.get('#btnGroupEdit_0').click();
        cy.get('#divGroundResourceTableView_1 > .text-center.border > .tableorder-center-text > a').click();
        cy.get('#add_resource_name').type('2-2번');
        cy.get('#btnTableNameOverCheck').click();
        cy.get(
            '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        ).click();
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
