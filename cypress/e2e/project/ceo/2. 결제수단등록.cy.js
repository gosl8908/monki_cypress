const { loginModule, emailModule, payModule } = require('../../module/manager.module.js');

describe('결제수단 등록', () => {
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
            Type: '대리점',
            Id: `${Cypress.env('StoreTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/account/partners"] > .btn').click(); // 계정관리
        cy.get('[href="/account/store"] > .btn').click(); // 매장관리
        cy.get('#keyword').type(Cypress.env('FavTestId2')); // 검색어
        cy.get('.card-body > .row > .my-sm-auto > .btn').click(); // 검색
        cy.get('#btnPayment_0').click(); // 결제 수단 설정
        cy.get('#modal_body > .row > .text-end > .btn').click(); // 결제수단 연동 등록
        cy.wait(1 * 1000);

        /* 일반결제 수단 설정 */
        payModule.pay({
            PgCompany: '스마트로',
            Type: '먼키앱',
            MidType: '신용카드',
            Mid: `${Cypress.env('SmatroMid')}`,
            Key: `${Cypress.env('SmatroKey')}`,
        });
        /* 간편결제 수단 설정 */
        payModule.pay({
            PgCompany: '스마트로',
            Type: '먼키앱',
            MidType: '카드등록 간편결제(인증)',
            Mid: `${Cypress.env('SmatroMid')}`,
            Key: `${Cypress.env('SmatroKey')}`,
            EasyId: `${Cypress.env('SmatroEasyKey')}`,
        });
        /* 디바이스 연동 수단 설정 */
        payModule.pay({
            PgCompany: 'KIS',
            Type: 'OFF-PG',
            MidType: '신용카드',
            Mid: `${Cypress.env('KISMid')}`,
            Key: `${Cypress.env('KISKey')}`,
            Tid: `${Cypress.env('KISTid')}`,
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
            TestRange: '결제 수단 등록' + `\n${allTests.map(test => `${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
