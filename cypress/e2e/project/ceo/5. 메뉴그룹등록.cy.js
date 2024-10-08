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
            Id: `${Cypress.env('FavTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        /* 메뉴그룹 생성 */
        const categories = [
            'NEW',
            '점보윙시리즈',
            '허니시리즈',
            '레드시리즈',
            '교촌시리즈',
            '믹스시리즈',
            '후라이드시리즈',
            '음료',
        ];

        categories.forEach(category => {
            cy.get('#btnAddMenuGroup').click();
            cy.wait(1000);
            cy.get('#category_nm').type(category);
            cy.get('.modal-footer > .btn-primary').click();
            cy.get('#vueMenuGroupMain').contains(category);
        });
        if (categories === '주류') {
            cy.contains('span', '주류')
                .parents('tr')
                .within(() => {
                    cy.get('button').contains('수정').click();
                });
            cy.wait(1000);
            cy.get('#use_kiosk_yn_true').click();
            cy.wait(1000);
            cy.get('#use_tableorder_yn_true').click();
            cy.wait(1000);
            cy.get('.modal-footer > .btn-primary').click();
            cy.wait(1000);
        }
    });

    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '메뉴 그룹 등록',
            Screenshots,
        });
    });
});
