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
            Id: `monkitest2`,
            Password: `test1234`,
        });
    });

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/table-order/main"] > .btn').click();

        const texts = [
            '라면',
            '비빔밥',
            '돈가스',
            '케익',
            '피자',
            '김밥',
            '불고기',
            '치즈돈가스',
            '샐러드',
            '참치김밥',
            '초밥',
            '쫄면',
            '고기국수',
            '비빔면',
            '골뱅이무침',
        ];

        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];

            if (text === '샐러드' || text === '참치김밥' || text === '초밥' || text === '쫄면') {
                cy.get(':nth-child(3) > .page-link').click();
            } else if (text === '고기국수' || text === '비빔면' || text === '골뱅이무침') {
                cy.get(':nth-child(4) > .page-link').click();
            }
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

        const texts2 = [
            '라면',
            '비빔밥',
            '돈가스',
            '케익',
            '피자',
            '코카콜라',
            '새로',
            '김밥',
            '불고기',
            '치즈돈가스', //
            '샐러드',
            '코카콜라제로',
            '진로',
            '참치김밥',
            '초밥',
            '펩시',
            '카스',
            '쫄면',
            '펩시제로',
            '테라', //
            '고기국수',
            '스프라이트',
            '비빔면',
            '스프라이트제로',
            '골뱅이무침',
        ];

        for (let i = 0; i < texts2.length; i++) {
            const text = texts2[i];

            if (
                text === '샐러드' ||
                text === '코카콜라제로' ||
                text === '진로' ||
                text === '참치김밥' ||
                text === '초밥' ||
                text === '펩시' ||
                text === '카스' ||
                text === '쫄면' ||
                text === '펩시제로' ||
                text === '테라'
            ) {
                cy.get(':nth-child(3) > .page-link').click();
            } else if (
                text === '고기국수' ||
                text === '스프라이트' ||
                text === '비빔면' ||
                text === '스프라이트제로' ||
                text === '골뱅이무침'
            ) {
                cy.get(':nth-child(4) > .page-link').click();
            }

            /* 메뉴 관리 */
            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.contains(text).click();
                });
            cy.wait(2 * 1000);
            const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];

            // Generate a random index between 0 and the length of the array minus 1
            const randomIndex = Math.floor(Math.random() * selectors.length);

            // Use the random index to click one of the selectors
            cy.get(selectors[randomIndex]).click();

            cy.get('#MN_001').click(); // 앱 노출 여부

            cy.get('.ms-auto').click(); // 변경하기
            cy.wait(2 * 1000);
            cy.get('#global_modal_confirm').click(); // 확인

            cy.go('back');
        }
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
});
