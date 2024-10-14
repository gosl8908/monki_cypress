const { loginModule, emailModule, menuModule } = require('../../module/manager.module.js');

describe('먼키앱 메뉴 옵션 관리', () => {
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

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/app"] > .btn').click(); // 먼키앱메뉴

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

        // 메뉴를 배열로 변환
        const menuArray = menuPrices
            .trim()
            .split('\n')
            .map(line => {
                const [menu] = line.split(',').map(item => item.trim()); // 메뉴 이름만 추출
                return { menu };
            });

        // 배열 역순으로 처리
        const reversedMenuArray = menuArray.reverse();
        reversedMenuArray.forEach(({ menu }) => {
            // 'text.menu'로 접근
            const checkMenuVisibility = (currentPage = 1) => {
                cy.wait(1 * 1000);
                cy.get('#container').then($container => {
                    const isMenuVisible =
                        $container.find('span').filter((i, el) => el.textContent.trim() === menu).length > 0;

                    if (!isMenuVisible) {
                        cy.get('.pagination')
                            .contains(currentPage + 1)
                            .click()
                            .then(() => {
                                // 다음 페이지로 이동 후 페이지가 로드될 때까지 대기
                                cy.get('#container').should('be.visible'); // 컨테이너가 보일 때까지 대기
                                checkMenuVisibility(currentPage + 1); // 다음 페이지에서 다시 확인
                            });
                    } else {
                        /* 옵션관리 */
                        cy.get('span')
                            .filter((i, el) => el.textContent.trim() === text)
                            .parents('tr')
                            .within(() => {
                                cy.get('button').click();
                            });
                        cy.wait(1 * 1000);
                        cy.get('#vueOptionContainer > .modal-content > .modal-body')
                            .contains('span', '사이드메뉴') // 옵션명
                            .parents('tr')
                            .within(() => {
                                cy.get('button').contains('추가').click();
                            });
                        cy.wait(1 * 1000);
                        cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click(); // 추가/변경
                        cy.wait(1 * 1000);
                        cy.get('#global_modal_confirm').click(); // 확인
                        cy.wait(1 * 1000);
                    }
                });
            };
            checkMenuVisibility(); // 메뉴 항목의 가시성을 확인
        });
    });
    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '먼키앱 메뉴 옵션 관리',
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
