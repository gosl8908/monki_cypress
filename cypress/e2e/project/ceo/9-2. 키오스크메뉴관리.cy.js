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
        const menu = `
        리얼옥수수의 진한 풍미와 달콤함이 특징인 촉촉하고 부드러운100% 통안심 순살메뉴
        리얼옥수수의 진한 풍미와 달콤함이 특징인 바삭하고 부드러운100% 정육 순살메뉴
        리얼옥수수의 진한 풍미와 달콤함이 특징인 한마리 치킨
        마늘 간장 맛과 매콤한 맛이 어우러진 한 마리 치킨
        마늘 간장 맛과 매콤한 맛이 밴 날개와 다리의 행복한 만남
        부드럽고 바삭한 정육 순살에 감칠 맛나는 마늘 간장 소스와 청양 홍고추의 매콤함을 동시에 느낄 수 있는 순살치킨
        마늘 간장 맛과 매콤한 맛이 밴 날개와 봉의 멋진 조화
        마늘 간장 맛과 매콤함 맛에 담백한 다리의 맛이 어우러진 치킨
        레드로 매콤하게, 허니로 달콤하게! 맵단맵단으로 즐길 수 있는 100% 국내산 정육, 안심 순살 메뉴
        교촌순살, 레드순살, 허니순살을 한 번에 즐길 수 있는 한 마리 반 세트 메뉴(1.5 마리)
        오트밀, 퀴노아, 아마란스 등 슈퍼푸드로 바삭함을 살린 후라이드
        [미니] 가슴살이 쌀가루와 만나 고소하고 바삭한 맛이 일품 (소스 3종 중 택1)
        가슴살과 다리살이 쌀가루와 만나 고소하고 바삭한 맛이 일품
        새콤달콤한 소이소스와 담백한 살살치킨에 신선한 채소를 곁들인 촉촉하며 바삭한 맛
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

        reversedMenuArray.forEach((text, index) => {
            // 인덱스는 0부터 시작하므로, 11번째부터는 10부터 시작합니다.
            if (index >= 10 && index < 19) {
                cy.get('.pagination').contains('2').click();
            } else if (index >= 20 && index < 29) {
                cy.get('.pagination').contains('3').click();
            } else if (index >= 30 && index < 39) {
                cy.get('.pagination').contains('4').click();
            }
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
            // cy.get('.multisteps-form__textarea').type(menu); // 메뉴 설명
            cy.get('.multisteps-form__textarea').type(reversedMenuDescriptions[index]);
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
    afterEach('Status Check', function () {
        emailModule.screenshot(Failure, Screenshots, this.currentTest);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '테이블오더 메뉴 관리',
            Screenshots,
        });
    });
});
