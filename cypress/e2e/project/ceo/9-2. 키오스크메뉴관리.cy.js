const { loginModule, emailModule, menuModule } = require('../../module/manager.module.js');

describe('키오스크 메뉴 관리', () => {
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

    it('KIOSK menu setting', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/kiosk"] > .btn').click();

        // 메뉴 가격 목록을 배열로 변환하고, 메뉴 항목만 추출
        const menuArray = `${Cypress.env('menuPrices')}`
            .trim() // 문자열의 시작과 끝의 공백을 제거합니다.
            .split('\n') // 각 줄을 배열의 요소로 분리합니다.
            .map(line => line.split(',')[0].trim()); // 각 줄을 쉼표로 분리하고 첫 번째 요소(메뉴 항목)만 가져옵니다.

        // 메뉴 설명을 배열로 변환
        const menuDescriptions = menu
            .trim()
            .split('\n')
            .map(description => description.trim());

        // 역순으로 정렬
        const reversedMenuArray = menuArray.reverse();
        const reversedMenuDescriptions = menuDescriptions.reverse();

        reversedMenuArray.forEach(text => {
            const checkMenuVisibility = (currentPage = 1) => {
                cy.wait(1 * 1000);
                cy.get('#vueTableOrderContainer').then($container => {
                    const isMenuVisible =
                        $container.find('span').filter((i, el) => el.textContent.trim() === text).length > 0;

                    if (!isMenuVisible) {
                        // 현재 페이지에서 메뉴 항목이 보이지 않으면 다음 페이지 클릭
                        cy.get('.pagination')
                            .contains(currentPage + 1)
                            .click();
                        cy.wait(1 * 1000); // 페이지 로딩 대기 후 다시 확인
                        checkMenuVisibility(currentPage + 1); // 다음 페이지에서 다시 확인
                    } else {
                        /* 상품관리 */
                        cy.get('span')
                            .filter((i, el) => el.textContent.trim() === text) // 정확히 일치하는 텍스트 필터링
                            .parents('tr')
                            .within(() => {
                                cy.get('span') // 클릭할 요소도 정확히 일치하는 텍스트 찾기
                                    .filter((i, el) => el.textContent.trim() === text)
                                    .click();
                            });

                        cy.wait(1 * 1000);
                        /* 미사용 / HOT / NEW / SALE / BEST */
                        const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];
                        const randomIndex = Math.floor(Math.random() * selectors.length);
                        cy.get(selectors[randomIndex]).click();
                        cy.wait(1 * 1000);
                        const description = reversedMenuDescriptions[reversedMenuArray.indexOf(text)];
                        cy.get('.multisteps-form__textarea').type(description);
                        cy.wait(1 * 1000);
                        cy.get('#MN_001').click(); // 앱 노출 여부
                        cy.wait(1 * 1000);
                        cy.get('.ms-auto').click(); // 변경하기
                        cy.wait(1 * 1000);
                        cy.get('#global_modal_confirm').click(); // 확인
                        cy.wait(1 * 1000);
                        cy.go('back');
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
                '키오스크 메뉴 관리' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
