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
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        //form-group // 사용
        //form-group disabled // 미사용
        // cy.contains('span', '주류')
        //     .parents('tr')
        //     .within(() => {
        //         cy.get('button').contains('수정').eq(0).click();
        //     });
        // cy.wait(1000);
        // cy.get('.card-body > :nth-child(5)').contains('사용').click();
        // cy.get('.modal-footer > .btn-primary').click();
        // cy.wait(1000);

        const menuGroups = {
            NEW: ['교촌옥수수통안심', '교촌옥수수순살', '교촌옥수수오리지날'],
            믹스시리즈: [
                '반반오리지날',
                '반반콤보',
                '반반순살',
                '반반윙',
                '반반스틱',
                '레허반반순살',
                '시그니처순살세트',
            ],
            후라이드시리즈: ['리얼후라이드', '살살후라이드미니', '살살후라이드', '파채소이살살'],
            // NEW: [
            //     '허니점보윙',
            //     '레드점보윙',
            //     '교촌점보윙',
            //     '반반점보윙(허니-교촌)',
            //     '반반점보윙(교촌-레드)',
            //     '반반점보윙(레드-허니)',
            // ],
            // 허니시리즈: ['허니순살', '허니콤보', '허니오리지날'],
            // 레드시리즈: ['레드스틱', '레드윙', '레드순살', '레드콤보', '레드오리지날'],
            // 교촌시리즈: ['교촌스틱', '교촌윙', '교촌순살', '교촌콤보', '교촌오리지날'],
            // 음료: ['코카콜라', '코카콜라-제로', '펩시', '펩시-제로', '스프라이트', '스프라이트-제로'],
            // 주류: ['새로', '진로', '카스', '테라'],
        };

        Object.entries(menuGroups).forEach(([group, items]) => {
            menuModule.menuGroup(group);
            cy.wait(1000);

            items.forEach(item => {
                menuModule.menuAdd(item);
            });

            cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            cy.wait(1000);
            cy.get('#global_modal_confirm').click();
        });
    });

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '테이블오더 메뉴 그룹 관리',
            Screenshots,
        });
    });
});
