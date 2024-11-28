const { loginModule, emailModule, menuModule } = require('../../module/manager.module.js');

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
            Id: `${Cypress.env('FavTestId')[4]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    it('Menu Group Delete', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 메뉴 그룹 삭제 */
        cy.get('[href="/menu/menu-group"] > .btn').click();
        cy.wait(1 * 1000);

        cy.get('.main-content').then($container => {
            if ($container.text().includes('테스트')) {
                cy.contains('span', '테스트')
                    .parents('tr')

                    .within(() => {
                        cy.get('button').contains('삭제').click();
                        cy.wait(1 * 1000);
                    });
                cy.get('#global_modal_confirm').click();
                cy.wait(1 * 1000);
            }
        });
    });

    afterEach('Status Check', function () {
        emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    });

    after('Send Email', function () {
        const { title: describeTitle, tests: allTests } = this.test.parent; // describe의 제목과 모든 테스트를 한 번에 가져오기
        emailModule.email({
            TestFails,
            describeTitle,
            EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
            TestRange:
                '테이블오더 메뉴 세팅' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
