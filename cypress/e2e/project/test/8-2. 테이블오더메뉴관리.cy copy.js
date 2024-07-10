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
            Id: `3046900670`,
            Password: `3046900670a`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/table-order/main"] > .btn').click();

        const menus = [
            {
                items: `
                   프랭크 버거
                   치즈버거
                   프랭크 버거 세트
                   치즈버거 세트
                   베이컨 치즈버거
                   베이컨 치즈버거 세트
                `,
                size: '사이즈선택(1)',
            },
            {
                items: `
                    더블 비프 치즈 버거
                    더블 비프 치즈 버거 세트
                `,
                size: '사이즈선택(2)',
            },
            {
                items: `
                    JG버거
                    JG버거 세트
                `,
                size: '사이즈선택(3)',
            },
        ];

        menus.forEach(menu => {
            const items = menu.items
                .trim()
                .split('\n')
                .map(item => item.trim());

            items.forEach(text => {
                // Pagination logic
                if (
                    text === '프랭크 버거' ||
                    text === '치즈버거' ||
                    text === '프랭크 버거 세트' ||
                    text === '치즈버거 세트'
                ) {
                    cy.get('.pagination').contains('2').click();
                } else if (text === '베이컨 치즈버거' || text === '베이컨 치즈버거 세트') {
                    cy.get('.pagination').contains('3').click();
                } else if (text === '더블 비프 치즈 버거 세트') {
                    cy.get('.pagination').contains('4').click();
                } else if (text === 'JG버거' || text === 'JG버거 세트' || text === '더블 비프 치즈 버거') {
                    cy.get('.pagination').contains('5').click();
                }

                /* 옵션관리 */
                cy.contains('span', text)
                    .parents('tr')
                    .within(() => {
                        cy.get('button').eq(0).click();
                    });
                cy.contains('span', menu.size)
                    .parents('tr')
                    .within(() => {
                        cy.get('button').contains('추가').click();
                    });

                cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
                cy.wait(1 * 1000);
                cy.get('#global_modal_confirm').click();
                cy.wait(1 * 1000);
            });
        });

        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            /* 옵션관리 */
            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.get('button').eq(0).click();
                });
            cy.contains('span', '사이즈선택')
                .parents('tr')
                .within(() => {
                    cy.get('button').contains('추가').click();
                });
            cy.contains('span', '추가선택')
                .parents('tr')
                .within(() => {
                    cy.get('button').contains('추가').click();
                });

            cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            cy.wait(1 * 1000);
            cy.get('#global_modal_confirm').click();
            cy.wait(1 * 1000);
        }

        cy.get(':nth-child(2) > .page-link').click();

        //메뉴
        const menu = `
        
        `;
        //메뉴 설명
        const descriptions = `

            `;
        const textList = menu
            .trim()
            .split('\n')
            .map(text => text.trim());
        const descriptionList = descriptions
            .trim()
            .split('\n')
            .map(text => text.trim());

        textList.forEach((text, index) => {
            goToPage(text);
            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.contains(text).click();
                });
            /* 미사용 HOT NEW SALE BEST */
            const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];

            const randomIndex = Math.floor(Math.random() * selectors.length);

            // Use the random index to click one of the selectors
            cy.get(selectors[randomIndex]).click();
            cy.get('#MN_001').click(); // 앱 노출 여부
            cy.wait(2000); // 2 seconds
            cy.get('.multisteps-form__textarea').type(descriptionList[index]);
            cy.get('.ms-auto').click(); // 변경하기
            cy.wait(2000); // 2 seconds
            cy.get('#global_modal_confirm').click(); // 확인
            cy.wait(2000);

            cy.go('back');
        });
    });
    // cy.get(selectors[randomIndex]).click();

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
});
