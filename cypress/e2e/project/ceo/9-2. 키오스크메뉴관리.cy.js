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

    it('Ceo Page Test', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/kiosk"] > .btn').click();

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
        테라,5000
        카스,5000
        진로,5000
        새로,5000
        스프라이트-제로,2500
        스프라이트,2500
        펩시-제로,2500
        펩시,2500
        코카콜라-제로,2500
        코카콜라,2500
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
        const menu = `
        파채소이살살, 새콤달콤한 소이소스와 담백한 살살치킨에 신선한 채소를 곁들인 촉촉하며 바삭한 맛
        살살후라이드, 가슴살이 쌀가루와 만나 고소하고 바삭한 맛이 일품
        살살후라이드미니, [미니] 가슴살이 쌀가루와 만나 고소하고 바삭한 맛이 일품 (소스 3종 중 택1)
        리얼후라이드, 오트밀, 퀴노아, 아마란스 등 슈퍼푸드로 바삭함을 살린 후라이드
        시그니처순살세트, 부드럽고 바삭한 순살과 함께 다양한 맛을 즐길 수 있는 시그니처 세트 메뉴
        레허반반순살, 레드로 매콤하게, 허니로 달콤하게! 맵단맵단으로 즐길 수 있는 100% 국내산 정육, 안심 순살 메뉴
        반반스틱, 마늘 간장 맛과 매콤함 맛에 담백한 다리의 맛이 어우러진 치킨
        반반윙, 마늘 간장 맛과 매콤한 맛이 밴 날개와 봉의 멋진 조화
        반반순살, 부드럽고 바삭한 정육 순살에 감칠 맛나는 마늘 간장 소스와 청양 홍고추의 매콤함을 동시에 느낄 수 있는 순살치킨
        반반콤보, 마늘 간장 맛과 매콤한 맛이 밴 날개와 다리의 행복한 만남
        반반오리지날, 마늘 간장 맛과 매콤한 맛이 어우러진 한 마리 치킨
        교촌옥수수오리지날, 리얼옥수수의 진한 풍미와 달콤함이 특징인 한 마리 치킨
        교촌옥수수순살, 리얼옥수수의 진한 풍미와 달콤함이 특징인 바삭하고 부드러운 100% 정육 순살메뉴
        교촌옥수수통안심, 리얼옥수수의 진한 풍미와 달콤함이 특징인 촉촉하고 부드러운 100% 통안심 순살메뉴
        테라, 테라와 동일
        카스, 카스와 동일
        진로, 진로와 동일
        새로, 새로와 동일
        스프라이트-제로, 스프라이트-제로와 동일
        스프라이트, 스프라이트와 동일
        펩시-제로, 펩시-제로와 동일
        펩시, 펩시와 동일
        코카콜라-제로, 코카콜라-제로와 동일
        코카콜라, 코카콜라와 동일
        허니순살, 살맛나는 꿀조합! 부드럽고 담백한 안심과 정육을 사용한 순살치킨과 달콤한 허니소스의 조화!
        허니콤보, 달콤한 허니소스에 쫄깃한 날개와 담백한 다리가 만난 메뉴
        허니오리지날, 달콤 바삭한 맛이 일품인 한 마리 치킨
        레드스틱, 국내산 청양 홍고추의 매콤함에 담백한 다리의 맛이 어우러진 치킨
        레드윙, 국내산 청양 홍고추의 매콤함이 골고루 밴 쫄깃한 날개와 봉의 만남!
        레드순살, 부드럽고 바삭한 정육 순살에 청양 홍고추의 매콤함이 맛있게 어우러진 순살치킨
        레드콤보, 국내산 청양 홍고추의 매콤한 맛에 날개와 다리를 함께 즐길 수 있는 메뉴
        레드오리지날, 국내산 청양 홍고추의 매콤함이 일품인 한 마리 치킨
        교촌스틱, 마늘과 간장 소스의 풍부한 맛과 다리부위의 담백한 맛이 어우러진 치킨
        교촌윙, 마늘과 간장소스의 풍부한 맛이 묻어나는 날개와 봉의 멋진 조화 교촌윙
        교촌순살, 부드럽고 바삭한 정육 순살에 감칠 맛나는 마늘 간장 소스가 어우러진 순살치킨
        교촌콤보, 마늘과 간장소스의 풍부한 맛에 가장 인기있는 부위인 날개와 다리를 함께 즐길 수 있는 메뉴
        교촌오리지날, 교촌만의 차별화된 마늘과 간장 소스의 풍부한 맛이 어우러진 한 마리 치킨
        허니점보윙, 허니에 갈릭을 더한 풍미 깊은 허니갈릭점보윙
        레드점보윙, 청양홍고추의 매콤함이 일품인 레드윙을 점보사이즈로 즐길 수 있는 메뉴
        교촌점보윙, 마늘간장소스의 교촌윙을 점보사이즈로 즐길 수 있는 메뉴
        반반점보윙(허니-교촌), 허니에 갈릭을 더한 풍미 깊은 허니갈릭점보윙과 마늘간장소스의 교촌점보윙을 한번에 맛볼 수 있는 메뉴
        반반점보윙(교촌-레드), 마늘간장소스의 교촌점보윙과 청양홍고추의 매콤함이 일품인 레드점보윙을 한번에 맛볼 수 있는 메뉴
        반반점보윙(레드-허니), 청양홍고추의 매콤함이 일품인 레드점보윙과 허니에 갈릭을 더한 풍미 깊은 허니갈릭점보윙을 한번에 맛볼 수 있는 메뉴
        `;

        // 메뉴 가격 목록을 배열로 변환하고, 메뉴 항목만 추출
        const menuArray = menuPrices
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
            TestRange: '키오스크 메뉴 관리' + `\n${allTests.map(test => `${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
