const { loginModule, emailModule, menuModule } = require('../../module/manager.module.js');

describe('메뉴 등록', () => {
    let TestFails = []; // 실패 원인을 저장할 변수
    let Screenshots = []; // 스크린샷을 저장할 배열
    let Failure = false;
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열

    Cypress.on('fail', (err, runnable) => {
        const ErrMessage = err.message || '알 수 없는 이유로 실패함';
        if (!TestFails.includes(ErrMessage)) {
            TestFails.push(ErrMessage);
            FailedTests.push(runnable.title); // 실패한 테스트의 타이틀을 저장
        }
        Failure = true;
        throw err;
    });
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        loginModule.login({
            Site: `${Cypress.env('Ceo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('상품 등록', () => {
        /* 메뉴관리 */
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.wait(1 * 1000);
        cy.get('#product').click(); // 상품관리 탭

        const menuPrices = `
        파채소이살살,19000
        살살후라이드,20000
        살살후라이드미니,7000
        리얼후라이드,20000
        시그니처순살세트,33000
        레허반반순살,23000
        반반스틱,23000
        반반윙,23000
        반반순살,23000
        반반콤보,23000
        반반오리지날,20000
        교촌옥수수오리지날,20000
        교촌옥수수순살,23000
        교촌옥수수통안심,23000
        테라,5000
        카스,5000
        진로,5000
        새로,5000
        스프라이트-제로,2500
        스프라이트,2500
        펩시-제로,2500
        펩시,2500
        코카콜라-제로,2500
        코카콜라,2500
        허니순살,19000
        허니콤보,23000
        허니오리지날,19000
        레드스틱,23000
        레드윙,23000
        레드순살,23000
        레드콤보,23000
        레드오리지날,20000
        교촌스틱,22000
        교촌윙,22000
        교촌순살,22000
        교촌콤보,22000
        교촌오리지날,19000
        허니점보윙,19000
        레드점보윙,19000
        교촌점보윙,19000
        반반점보윙(허니-교촌),19000
        반반점보윙(교촌-레드),19000
        반반점보윙(레드-허니),19000
        `;

        menuPrices
            .trim()
            .split('\n')
            .forEach(item => {
                const [menu, price] = item.trim().split(',');
                menuModule.menu(menu, price, 'png');
            });
    });

    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '메뉴 상품 등록',
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
