const { loginModule, emailModule, menuModule } = require('../../../module/manager.module.js');

describe('키오스크 메뉴 옵션 관리', () => {
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `http://43.202.11.133:3002/users/login`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('TestId')[1]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    it('KIOSK menu option setting', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/kiosk"] > .btn').click();

        // 메뉴를 배열로 변환
        const menuArray = `${Cypress.env('menuPrices')}`
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
        emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    });
    after('Send Email', function () {
        const { title: describeTitle, tests: allTests } = this.test.parent; // describe의 제목과 모든 테스트를 한 번에 가져오기

        emailModule.email({
            TestFails,
            describeTitle,
            EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
            TestRange:
                '키오스크 메뉴 옵션 관리' +
                `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
