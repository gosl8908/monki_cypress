const { loginModule, emailModule } = require('../../../module/manager.module.js');

describe('키오스크 메뉴 그룹 관리', () => {
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `https://staging-ceo-kiosk.monthlykitchen.kr/users/login`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('TestId')[1]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    it('KIOSK menu group setting', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        const menuGroups = {
            NEW: ['교촌옥수수통안심', '교촌옥수수순살', '교촌옥수수오리지날'],
            믹스시리즈: [
                '반반오리지날',
                '반반콤보',
                '반반순살',
                '반반윙',
                '반반스틱',
                '레허반반순살',
                '시그니처순살세트',
            ],
            후라이드시리즈: ['리얼후라이드', '살살후라이드미니', '살살후라이드', '파채소이살살'],
            점보윙시리즈: [
                '허니점보윙',
                '레드점보윙',
                '교촌점보윙',
                '반반점보윙(허니-교촌)',
                '반반점보윙(교촌-레드)',
                '반반점보윙(레드-허니)',
            ],
            허니시리즈: ['허니순살', '허니콤보', '허니오리지날'],
            레드시리즈: ['레드스틱', '레드윙', '레드순살', '레드콤보', '레드오리지날'],
            교촌시리즈: ['교촌스틱', '교촌윙', '교촌순살', '교촌콤보', '교촌오리지날'],
            반반시리즈: [
                '교촌스틱[S]',
                '레드콤보[S]',
                '레드순살[S]',
                '레드윙[S]',
                '레드스틱[S]',
                '교촌순살[S]',
                '교촌콤보[S]',
                '교촌윙[S]',
                '허니순살[S]',
            ],
            사이드메뉴: [
                '꽈배기',
                '달걀듬뿍볶음밥',
                '국물맵떡',
                '퐁듀치즈볼(3개)',
                '퐁듀치즈볼(6개)',
                '고르곤치즈볼(3개)',
                '고르곤치즈볼(6개)',
                '웨지감자',
                '칩카사바',
                '포테이토앤칩스',
                '샐러드',
                '소이파채샐러드',
                '한입쏙직화닭발',
                '츠쿠네어묵탕',
            ],
            음료: ['코카콜라', '코카콜라-제로', '펩시', '펩시-제로', '스프라이트', '스프라이트-제로'],
            주류: ['새로', '진로', '참이슬', '카스', '테라'],
        };

        Object.entries(menuGroups).forEach(([group, items]) => {
            createModule.menuGroup(group, items, '키오스크');
            cy.wait(1000);
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
                '테이블오더 메뉴 그룹 관리' +
                `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
