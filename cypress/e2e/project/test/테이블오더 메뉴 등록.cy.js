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
    const optionPrices = `
        옥수수볼,5000
        달걀듬뿍볶음밥,4000
        의성마늘볶음밥,4000
        샐러드 추가,5000
        고르곤치즈볼,6000
        와일드블랙소스,1000
        허니케찹소스,1000
        치즈트러플시즈닝,2000
        무 추가,1000
        레드디핑소스,1000
        `;

    it('Product Create', () => {
        /* 메뉴관리 */
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.wait(1 * 1000);
        cy.get('#product').click(); // 상품관리 탭

        `${Cypress.env('menuPrices')}`
            .trim()
            .split('\n')
            .forEach(item => {
                const [menu, price] = item.trim().split(',');
                menuModule.menu(menu, price, 'png', '교촌');
            });
    });

    it('option group create', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/option"] > .btn').click();

        function registerOptionGroup(optionGroup) {
            const { size, options } = optionGroup;

            cy.get('.col-12 > .btn').click();
            cy.get('[id="OP_002"]').click(); // 다중
            cy.get('[name="optionMaxCount"]').clear().type('10'); // 수량
            cy.get('[id="requireYn_false"]').click(); // 선택
            cy.get('[name="optionGroupNm"]').type(size); // 그룹명
            for (let i = 0; i < options.length - 1; i++) {
                cy.get('div.col-3 > .btn').click();
            }

            options.forEach((option, index) => {
                cy.get('[name="optionNm"]').eq(index).type(option.name); // 옵션명
                cy.get('[name="optionPrice"]').eq(index).clear().type(option.price); // 가격
            });

            cy.get('.ms-auto').click();
            cy.wait(1000); // 1 second wait
            cy.get('#global_modal_confirm').click();
        }
        const optionsArray = `${Cypress.env('optionPrices')}`
            .trim()
            .split('\n')
            .map(line => {
                const [name, price] = line.split(',').map(item => item.trim());
                return { name, price };
            });

        const optionGroups = [
            {
                size: '사이드메뉴',
                options: optionsArray,
            },
        ];

        optionGroups.forEach(group => {
            registerOptionGroup(group);
        });
    });

    it('Menu Group Create', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        /* 메뉴그룹 생성 */
        const categories = [
            'NEW',
            '점보윙시리즈',
            '허니시리즈',
            '레드시리즈',
            '교촌시리즈',
            '믹스시리즈',
            '후라이드시리즈',
            '반반시리즈',
            '사이드메뉴',
            '음료',
            '주류',
        ];

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

    it('TABLEORDER Menu Group Setup', () => {
        /* 메뉴관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/menu/menu-group"] > .btn').click();

        const menuGroups2 = {
            //menuPrices를 사용하여 메뉴 그룹을 관리
            사이드메뉴: menuPrices
                .trim() // 공백 제거
                .split('\n') // 줄별로 분리
                .map(item => item.split(',')[0].trim()), // 메뉴 이름만 추출
        };
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
                '시그니처점보윙',
            ],
            허니시리즈: ['허니순살', '허니콤보', '허니오리지날'],
            레드시리즈: ['레드스틱', '레드윙', '레드순살', '레드콤보', '레드오리지날'],
            교촌시리즈: ['교촌스틱', '교촌윙', '교촌순살', '교촌콤보', '교촌오리지날'],
            반반시리즈: [
                '허니순살[S]',
                '교촌콤보[S]',
                '교촌윙[S]',
                '교촌순살[S]',
                '교촌스틱[S]',
                '레드콤보[S]',
                '레드순살[S]',
                '레드윙[S]',
                '레드스틱[S]',
            ],
            사이드메뉴: [
                '츠쿠네어묵탕',
                '한입쏙직화닭발',
                '소이파채샐러드',
                '샐러드',
                '포테이토앤칩스',
                '칩카사바',
                '웨지감자',
                '고르곤치즈볼(6개)',
                '고르곤치즈볼(3개)',
                '퐁듀치즈볼(6개)',
                '퐁듀치즈볼(3개)',
                '국물맵떡',
                '달걀듬뿍볶음밥',
                '꽈배기',
            ],
            음료: ['코카콜라', '코카콜라-제로', '펩시', '펩시-제로', '스프라이트', '스프라이트-제로'],
            주류: ['새로', '진로', '카스', '테라', '참이슬'],
        };
        Object.entries(menuGroups).forEach(([group, items]) => {
            menuModule.menuGroup(group, items, '테이블오더');
            cy.wait(1000);
        });
    });

    it('TABLEORDER menu setting', () => {
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

    it('TABLEORDER menu option setting', () => {
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

    after('Send Email', function () {
        const { title: describeTitle, tests: allTests } = this.test.parent; // describe의 제목과 모든 테스트를 한 번에 가져오기
        emailModule.email({
            TestFails,
            describeTitle,
            EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
            TestRange:
                '테이블오더 메뉴 세팅' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
