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
            Type: '사장님',
            Id: `${Cypress.env('CeoTestId')[1]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/app"] > .btn').click(); // 먼키앱메뉴

        const menuPrices = `
테스트,1000
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
            } else if (index >= 20 && index < 30) {
                cy.get('.pagination').contains('3').click();
            } else if (index >= 31 && index < 40) {
                cy.get('.pagination').contains('4').click();
            }
            // const manageOptions = (text, pageChangeConditions) => {
            //     if (pageChangeConditions.includes(text)) {
            //         cy.get(':nth-child(3) > .page-link').click();
            //     }
            /* 옵션관리 */
            cy.get('span')
                .filter((i, el) => el.textContent.trim() === text)
                .parents('tr')
                .within(() => {
                    cy.get('button').eq(0).click();
                });
            //     cy.wait(1 * 1000);
            //     cy.contains('span', '추가선택')
            //         .parents('tr')
            //         .within(() => {
            //             cy.get('button').contains('추가').click();
            //         });
            //     cy.wait(1 * 1000);
            //     cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            //     cy.wait(1 * 1000);
            //     cy.get('#global_modal_confirm').click();
            //     cy.wait(1 * 1000);
            // };

            /* 메뉴 관리 */
            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.get('.align-middle.text-center').eq(3).contains(text).click();
                });
            cy.wait(2 * 1000);
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

    // const pageChangeConditions1 = ['향어 3kg', '송어 3kg (5~6인분)'];

    // const manageOptions = (text, pageChangeConditions) => {
    //     if (pageChangeConditions.includes(text)) {
    //         cy.get(':nth-child(3) > .page-link').click();
    //     }
    //     cy.contains('span', text)
    //         .parents('tr')
    //         .within(() => {
    //             cy.get('button').eq(0).click();
    //         });
    //     cy.contains('span', '추가선택')
    //         .parents('tr')
    //         .within(() => {
    //             cy.get('button').contains('추가').click();
    //         });
    //     cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
    //     cy.wait(1000);
    //     cy.get('#global_modal_confirm').click();
    //     cy.wait(1000);
    // };

    // texts1.forEach(text2 => manageOptions(text2, pageChangeConditions1));
    // cy.get(':nth-child(2) > .page-link').click();

    // const manageMenus = (text2, pageChangeConditions) => {
    //     if (pageChangeConditions.includes(text2)) {
    //         cy.get(':nth-child(3) > .page-link').click();
    //     }
    //     cy.contains('span', text2)
    //         .parents('tr')
    //         .within(() => {
    //             cy.contains(text2).click();
    //         });
    //     cy.wait(3000);
    //     cy.get('#bestMenuYn_true').click();
    //     cy.wait(1000);

    //     // const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];
    //     // const randomIndex = Math.floor(Math.random() * selectors.length);
    //     // cy.get(selectors[randomIndex]).click();

    //     cy.wait(1000);
    //     cy.get('name="menuDesc"').type('초장+간장+와사비');
    //     cy.wait(1000);
    //     cy.get('#MN_001').click();
    //     cy.wait(1000);
    //     cy.get('.ms-auto').click();
    //     cy.wait(1000);
    //     cy.get('#global_modal_confirm').click();
    //     cy.wait(1000);
    //     cy.go('back');
    // };

    // texts2.forEach(text2 => manageMenus(text2, pageChangeConditions2));

    // for (let i = 0; i < texts.length; i++) {
    //     const text = texts[i];

    //     /* 옵션관리 */
    //     cy.contains('span', text)
    //         .parents('tr')
    //         .within(() => {
    //             cy.get('button').eq(0).click();
    //         });
    //     cy.contains('span', '사이즈선택')
    //         .parents('tr')
    //         .within(() => {
    //             cy.get('button').contains('추가').click();
    //         });
    //     cy.contains('span', '추가선택')
    //         .parents('tr')
    //         .within(() => {
    //             cy.get('button').contains('추가').click();
    //         });

    //     cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
    //     cy.wait(1 * 1000);
    //     cy.get('#global_modal_confirm').click();
    //     cy.wait(1 * 1000);
    // }
    // cy.get(':nth-child(2) > .page-link').click();

    // for (let i = 0; i < texts2.length; i++) {
    //     const text = texts2[i];

    //     /* 메뉴관리 */
    //     cy.contains('span', text)
    //         .parents('tr')
    //         .within(() => {
    //             cy.get('button').eq(1).click();
    //         });
    //     cy.wait(3 * 1000);
    //     cy.get('#bestMenuYn_true').click(); // 대표메뉴
    //     /* 뱃지 랜덤 부여 */
    //     const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];

    //     // Generate a random index between 0 and the length of the array minus 1
    //     const randomIndex = Math.floor(Math.random() * selectors.length);

    //     // Use the random index to click one of the selectors
    //     cy.get(selectors[randomIndex]).click();

    //     cy.get('#MN_001').click(); // 앱 노출 여부

    //     cy.get('.ms-auto').click(); // 변경하기
    //     cy.wait(1 * 1000);
    //     cy.get('#global_modal_confirm').click(); // 확인

    //     cy.go('back');
    // }

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '먼키앱 메뉴 관리',
            Screenshots,
        });
    });
});
