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
    꽈배기,4000,처음엔 바삭하고 씹을수록 쫄깃한, 겉바속쫀 꽈배기(3ea)
    달걀듬뿍볶음밥,4500,교촌과 가장 잘 어울리는 치밥 메뉴, 부드러운 스크램블 달걀이 듬뿍 들어가 고소한 맛이 일품인 볶음밥
    국물맵떡,9000,깔끔한 매운맛 국물이 일품! 치킨이랑 더욱 잘 어울리는 기본에 충실한 국물 밀떡볶이
    퐁듀치즈볼(3개),3500,쫄깃한 찹쌀볼을 한 입 물면 퐁듀치즈가 와르르! 쫄깃 바삭 퐁듀치즈볼(3ea)
    퐁듀치즈볼(6개),6000,쫄깃한 찹쌀볼을 한 입 물면 퐁듀치즈가 와르르! 쫄깃 바삭 퐁듀치즈볼(사워크림씨즈닝 포함)(6ea)
    고르곤치즈볼(3개),3500,달콤한 초코 찹쌀볼에 고르곤졸라치즈를 듬뿍 넣어 단짠의 매력을 더한 치즈볼(3ea)
    고르곤치즈볼(6개),6000,달콤한 초코 찹쌀볼에 고르곤졸라치즈를 듬뿍 넣어 단짠의 매력을 더한 치즈볼(사워크림씨즈닝 포함)(6ea)
    웨지감자,4000,깨끗하고 고소한 교촌전용유에 바삭하게 튀겨낸 담백한 감자튀김
    칩카사바,2000,열대 뿌리 식물인 카사바를 튀기고, 그 위에 진한 풍미의 치즈트러플시즈닝을 뿌려낸 바삭한 칩 메뉴
    포테이토앤칩스,6500,Big Size 점보팩 치즈솔솔(트러플) 시즈닝으로 더욱 맛있게 즐기는 듀얼(포테이토&카사바) 스낵
    샐러드,5000,다양한 채소와 샐러드 소스로 신선함을 그대로 즐길 수 있는 프리미엄 샐러드
    소이파채샐러드,4000,새콤달콤한 소이소스와 신선한 채소를 곁들인 샐러드
    한입쏙직화닭발,17000,불향 가득 맛있게 매운 맛 먹기 편한 튤립 닭발과 아삭한 파채를 곁들여 먹는 술 안주로 제격인 매콤한 직화 닭발
    츠쿠네어묵탕,18000,교촌치킨X삼진어묵 콜라보 어육함량이 높은 품질 좋은 삼진어묵과 탱글한 식감이 일품인 츠쿠네(닭완자꼬치)를 넣어 깔끔한 국물맛이 일품인 교촌 어묵탕
    `;

    it('Product Create', () => {
        /* 메뉴관리 */
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.wait(1 * 1000);
        cy.get('#product').click(); // 상품관리 탭

        menuPrices
            .trim()
            .split('\n')
            .forEach(item => {
                const [menu, price] = item.trim().split(',');
                menuModule.menu(menu, price, 'png');
            });
    });

    it('Menu Group Create', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        /* 메뉴그룹 생성 */
        const categories = ['사이드메뉴'];

        categories.forEach(category => {
            cy.get('#btnAddMenuGroup').click();
            cy.wait(1000);
            cy.get('#category_nm').type(category);
            cy.get('.modal-footer > .btn-primary').click();
            cy.get('#vueMenuGroupMain').contains(category);
        });
        if (categories === '주류') {
            cy.contains('span', '주류')
                .parents('tr')
                .within(() => {
                    cy.get('button').contains('수정').click();
                });
            cy.wait(1000);
            cy.get('#use_kiosk_yn_true').click();
            cy.wait(1000);
            cy.get('#use_tableorder_yn_true').click();
            cy.wait(1000);
            cy.get('.modal-footer > .btn-primary').click();
            cy.wait(1000);
        }
    });

    it('테이블오더 Menu Group Setup', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        // menuPrices를 사용하여 메뉴 그룹을 관리
        const menuGroups = {
            사이드메뉴: menuPrices
                .trim() // 공백 제거
                .split('\n') // 줄별로 분리
                .map(item => item.split(',')[0].trim()), // 메뉴 이름만 추출
        };
        Object.entries(menuGroups).forEach(([group, items]) => {
            menuModule.menuGroup(group, items, '테이블오더');
            cy.wait(1000);
        });
    });

    it('테이블오더 메뉴 관리', () => {
        /* 테이블오더 메뉴관리 */
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/table-order/main"] > .btn').click();

        // menuPrices를 사용하여 메뉴와 설명을 처리
        const menuArray = menuPrices
            .trim()
            .split('\n')
            .map(line => {
                const [menu, , description] = line.split(',').map(item => item.trim()); // 메뉴 이름과 설명 추출
                return { menu, description };
            });

        // 역순으로 정렬
        const reversedMenuArray = menuArray.reverse();
        reversedMenuArray.forEach(({ menu, description }) => {
            const checkMenuVisibility = (currentPage = 1) => {
                cy.wait(1 * 1000);
                cy.get('#vueTableOrderContainer').then($container => {
                    const isMenuVisible =
                        $container.find('span').filter((i, el) => el.textContent.trim() === menu).length > 0;

                    if (!isMenuVisible) {
                        cy.get('.pagination')
                            .contains(currentPage + 1)
                            .click();
                        cy.wait(1 * 1000);
                        checkMenuVisibility(currentPage + 1);
                    } else {
                        cy.get('span')
                            .filter((i, el) => el.textContent.trim() === menu)
                            .parents('tr')
                            .within(() => {
                                cy.get('span')
                                    .filter((i, el) => el.textContent.trim() === menu)
                                    .click();
                            });

                        cy.wait(1 * 1000);
                        // 미사용 / HOT / NEW / SALE / BEST
                        const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];
                        const randomIndex = Math.floor(Math.random() * selectors.length);
                        cy.get(selectors[randomIndex]).click();
                        cy.wait(1 * 1000);
                        cy.get('.multisteps-form__textarea').type(description); // 메뉴 설명 입력
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

    it('테이블오더 메뉴 옵션 관리', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/table-order/main"] > .btn').click();

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
                                cy.get('#container').should('be.visible');
                                checkMenuVisibility(currentPage + 1); // 다음 페이지로 확인
                            });
                    } else {
                        // 옵션 관리 버튼 클릭
                        cy.get('span')
                            .filter((i, el) => el.textContent.trim() === menu)
                            .parents('tr')
                            .within(() => {
                                cy.get('button').click(); // 옵션 관리 버튼
                            });
                        cy.wait(1 * 1000);
                        cy.get('#vueOptionContainer > .modal-content > .modal-body')
                            .contains('span', '사이드메뉴') // 옵션명
                            .parents('tr')
                            .within(() => {
                                cy.get('button').contains('추가').click(); // 추가 버튼
                            });
                        cy.wait(1 * 1000);
                        cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click(); // 추가/변경 버튼
                        cy.wait(1 * 1000);
                        cy.get('#global_modal_confirm').click(); // 확인 버튼
                        cy.wait(1 * 1000);
                    }
                });
            };
            checkMenuVisibility(); // 메뉴 가시성 확인 호출
        });
    });

    afterEach('Status Check', function () {
        emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    });

    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '1. 테이블오더 메뉴 세팅',
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
