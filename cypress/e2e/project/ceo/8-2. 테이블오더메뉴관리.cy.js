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
            Id: `${Cypress.env('FavTestId3')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/table-order/main"] > .btn').click();

        const menuPrices = `
테라,6000
카스,6000
진로,6000
새로,6000
스프라이트-제로,2500
스프라이트,2500
펩시-제로,2500
펩시,2500
코카콜라-제로,2500
코카콜라,2500
허니순살,23000
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

        // 메뉴 가격 목록을 배열로 변환하고, 메뉴 항목만 추출
        const menuArray = menuPrices
            .trim() // 문자열의 시작과 끝의 공백을 제거합니다.
            .split('\n') // 각 줄을 배열의 요소로 분리합니다.
            .map(line => line.split(',')[0]); // 각 줄을 쉼표로 분리하고 첫 번째 요소(메뉴 항목)만 가져옵니다.

        // 역순으로 정렬
        const reversedMenuArray = menuArray.reverse();

        reversedMenuArray.forEach((text, index) => {
            // 인덱스는 0부터 시작하므로, 11번째부터는 10부터 시작합니다.
            if (index >= 10 && index < 19) {
                cy.get('.pagination').contains('2').click();
            } else if (index >= 20 && index < 29) {
                cy.get('.pagination').contains('3').click();
            } else if (index >= 30 && index < 39) {
                cy.get('.pagination').contains('4').click();
            }

            /* 옵션관리 */
            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.get('button').eq(0).click();
                });
            cy.contains('span', '사이드메뉴') // 옵션명
                .parents('tr')
                .within(() => {
                    cy.get('button').contains('추가').click();
                });
            cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click(); // 추가/변경
            cy.wait(2 * 1000);
            cy.get('#global_modal_confirm').click(); // 확인
            cy.wait(2 * 1000);

            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.contains(text).click();
                });

            cy.wait(1 * 1000);
            /* 미사용 / HOT / NEW / SALE / BEST */
            const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];
            const randomIndex = Math.floor(Math.random() * selectors.length);
            cy.get(selectors[randomIndex]).click();
            cy.wait(1 * 1000);
            cy.get('.multisteps-form__textarea').type(text); // 메뉴 설명
            cy.wait(1 * 1000);
            cy.get('#MN_001').click(); // 앱 노출 여부
            cy.wait(1 * 1000);
            cy.get('.ms-auto').click(); // 변경하기
            cy.wait(1 * 1000);
            cy.get('#global_modal_confirm').click(); // 확인
            cy.wait(1 * 1000);
            cy.go('back');
        });
    });
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
