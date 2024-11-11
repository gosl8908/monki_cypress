const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('Test', () => {
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `${Cypress.env('StgCeo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('TestId')[1]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });
    it('TableOrder Staff Call Setup', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 테이블오더 */
        cy.get('[href="/menu/table-order/main"] > .btn').click();
        cy.wait(1 * 1000);

        cy.get('#employee').click();
        cy.wait(1 * 1000);
        cy.get('#btnEmployeeAdd').click();
        cy.wait(1 * 1000);
        cy.get('#add_ItemName').type('물');
        cy.wait(1 * 1000);
        cy.get('#btnItemNameCheck').click();
        cy.wait(1 * 1000);
        cy.get('#btnItemFormCheck').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click({ force: true });
        cy.wait(1 * 1000);
        cy.get('#container')
            .contains('물', { timeout: 3 * 1000 })
            .should('be.visible');
    });
    // it('Fail1', () => {
    //     cy.contains('345', { timeout: 1 * 1000 });
    // });
    // it('Pass2', () => {
    //     cy.contains('단골맛집', { timeout: 1 * 1000 });
    // });
    // it('Fail2', () => {
    //     cy.contains('678', { timeout: 1 * 1000 });
    // });

    // afterEach('Status Check', function () {
    //     emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    // });
    // after('Send Email', function () {
    //     const { title: describeTitle, tests: allTests } = this.test.parent; // describe의 제목과 모든 테스트를 한 번에 가져오기
    //     emailModule.email({
    //         TestFails,
    //         describeTitle,
    //         EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
    //         TestRange:
    //             '테스트 스크립트1' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
    //         Screenshots,
    //         currentTest: FailedTests,
    //     });
    // });
});
