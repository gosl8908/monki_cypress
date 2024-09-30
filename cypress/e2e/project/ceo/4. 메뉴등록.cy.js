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
            Site: `${Cypress.env('Ceo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('TestId')[1]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.wait(1 * 1000);
        cy.get('#product').click(); // 상품관리 탭

        const menuPrices = `
        교촌옥수수통안심,23000
        교촌옥수수순살,23000
        교촌옥수수오리지날,20000
        반반오리지날,20000
        반반콤보,23000
        반반순살,23000
        반반윙,23000
        반반스틱,23000
        레허반반순살,23000
        시그니처순살세트,33000
        리얼후라이드,20000
        살살후라이드미니,7000
        살살후라이드,20000
        파채소이살살,19000
        
        `;

        menuPrices
            .trim()
            .split('\n')
            .forEach(item => {
                const [menu, price] = item.trim().split(',');
                menuModule.menu(menu, price, 'png');
            });
    });

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '메뉴 상품 등록',
            Screenshots,
        });
    });
});
