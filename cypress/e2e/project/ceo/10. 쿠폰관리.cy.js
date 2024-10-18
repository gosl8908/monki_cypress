const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('쿠폰관리', () => {
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `${Cypress.env('Ceo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId')[2]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        cy.get(':nth-child(3) > .container-fluid > .d-flex').contains('운영관리').click();
        cy.get('[style="display: block;"] > .container-fluid > .d-flex').contains('쿠폰관리').click();
        cy.get('.col-12 > .btn').contains('쿠폰 등록').click();

        /* 쿠폰 정보 */
        cy.get('#coupon_nm').type(Cypress.env('Date') + ' 쿠폰테스트'); // 쿠폰명
        cy.get('#coupon_price').type('10000'); // 쿠폰 할인 금액
        cy.wait(1 * 1000);
        cy.get('#min_order_price').type('5000'); // 최소 주문 금액
        cy.wait(1 * 1000);
        cy.get('#page_modal_confirm').contains('적용').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').contains('확인').click();
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
            TestRange: '쿠폰 관리' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
