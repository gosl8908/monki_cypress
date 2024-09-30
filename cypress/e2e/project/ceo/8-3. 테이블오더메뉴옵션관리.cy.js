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
            Site: `${Cypress.env('StgCeo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('TestId')[1]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/table-order/main"] > .btn').click();

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

        // 메뉴 가격 목록을 배열로 변환하고, 메뉴 항목만 추출
        const menuArray = menuPrices
            .trim() // 문자열의 시작과 끝의 공백을 제거합니다.
            .split('\n') // 각 줄을 배열의 요소로 분리합니다.
            .map(line => line.split(',')[0].trim()); // 각 줄을 쉼표로 분리하고 첫 번째 요소(메뉴 항목)만 가져옵니다.

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
            cy.get('span')
                .filter((i, el) => el.textContent.trim() === text)
                .parents('tr')
                .within(() => {
                    cy.get('button').click();
                });
            cy.wait(1 * 1000);
            cy.contains('span', '사이드메뉴') // 옵션명
                .parents('tr')
                .within(() => {
                    cy.get('button').contains('추가').click();
                });
            cy.wait(1 * 1000);
            cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click(); // 추가/변경
            cy.wait(1 * 1000);
            cy.get('#global_modal_confirm').click(); // 확인
            cy.wait(1 * 1000);
        });
    });
    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '테이블오더 메뉴 옵션 관리',
            Screenshots,
        });
    });
});
