const { loginModule, emailModule, menuModule } = require('../../module/manager.module.js');

describe('Test', () => {
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `${Cypress.env('StgCeo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('TestId')[1]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });
    const menuPrices = `
    꽈배기,4000,처음엔 바삭하고 씹을수록 쫄깃한 겉바속쫀 꽈배기(3ea)
    달걀듬뿍볶음밥,4500,교촌과 가장 잘 어울리는 치밥 메뉴 부드러운 스크램블 달걀이 듬뿍 들어가 고소한 맛이 일품인 볶음밥
    국물맵떡,9000,깔끔한 매운맛 국물이 일품! 치킨이랑 더욱 잘 어울리는 기본에 충실한 국물 밀떡볶이
    퐁듀치즈볼(3개),3500,쫄깃한 찹쌀볼을 한 입 물면 퐁듀치즈가 와르르! 쫄깃 바삭 퐁듀치즈볼(3ea)
    퐁듀치즈볼(6개),6000,쫄깃한 찹쌀볼을 한 입 물면 퐁듀치즈가 와르르! 쫄깃 바삭 퐁듀치즈볼(사워크림씨즈닝 포함)(6ea)
    고르곤치즈볼(3개),3500,달콤한 초코 찹쌀볼에 고르곤졸라치즈를 듬뿍 넣어 단짠의 매력을 더한 치즈볼(3ea)
    고르곤치즈볼(6개),6000,달콤한 초코 찹쌀볼에 고르곤졸라치즈를 듬뿍 넣어 단짠의 매력을 더한 치즈볼(사워크림씨즈닝 포함)(6ea)
    웨지감자,4000,깨끗하고 고소한 교촌전용유에 바삭하게 튀겨낸 담백한 감자튀김
    칩카사바,2000,열대 뿌리 식물인 카사바를 튀기고 그 위에 진한 풍미의 치즈트러플시즈닝을 뿌려낸 바삭한 칩 메뉴
    포테이토앤칩스,6500,Big Size 점보팩 치즈솔솔(트러플) 시즈닝으로 더욱 맛있게 즐기는 듀얼(포테이토&카사바) 스낵
    샐러드,5000,다양한 채소와 샐러드 소스로 신선함을 그대로 즐길 수 있는 프리미엄 샐러드
    소이파채샐러드,4000,새콤달콤한 소이소스와 신선한 채소를 곁들인 샐러드
    한입쏙직화닭발,17000,불향 가득 맛있게 매운 맛 먹기 편한 튤립 닭발과 아삭한 파채를 곁들여 먹는 술 안주로 제격인 매콤한 직화 닭발
    츠쿠네어묵탕,18000,교촌치킨X삼진어묵 콜라보 어육함량이 높은 품질 좋은 삼진어묵과 탱글한 식감이 일품인 츠쿠네(닭완자꼬치)를 넣어 깔끔한 국물맛이 일품인 교촌 어묵탕
    `;
    // Parse menuPrices into an array of menu names
    const parseMenuNames = menuString => {
        return menuString
            .trim()
            .split('\n')
            .map(line => line.split(',')[0].trim());
    };
    const menuNames = parseMenuNames(menuPrices);
    it('Menu Group Setup', () => {
        /* 메뉴 그룹 */
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.get('[href="/menu/menu-group"] > .btn').click();
        const menuGroups = {
            사이드메뉴: menuNames,
        };

        Object.entries(menuGroups).forEach(([group, items]) => {
            menuModule.menuGroup(group, items, '테이블오더');
            cy.wait(1000);
        });
    });
    // it('Fail1', () => {
    //     cy.contains('345', { timeout: 1 * 1000 });
    // });
    // it('Pass2', () => {
    //     cy.contains('단골맛집', { timeout: 1 * 1000 });
    // });
    // it('Fail2', () => {
    //     cy.contains('678', { timeout: 1 * 1000 });
    // });

    // afterEach('Status Check', function () {
    //     emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    // });
    // after('Send Email', function () {
    //     const { title: describeTitle, tests: allTests } = this.test.parent; // describe의 제목과 모든 테스트를 한 번에 가져오기
    //     emailModule.email({
    //         TestFails,
    //         describeTitle,
    //         EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
    //         TestRange:
    //             '테스트 스크립트1' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
    //         Screenshots,
    //         currentTest: FailedTests,
    //     });
    // });
});
