const { loginModule, emailModule, menuModule, tableModule } = require('../../module/manager.module.js');

describe('Automation Testing', () => {
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
            Site: `${Cypress.env('StgCeo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId')[0]}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('메뉴 관리', () => {
        /* 메뉴관리 */
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.wait(1 * 1000);

        /* 상품분류관리 */
        cy.get('#vueProductDivContainer').then($container => {
            // '기본'이라는 텍스트가 포함된 요소가 있는지 확인
            if ($container.text().includes('기본')) {
                // 기본이 이미 존재하는 경우
                return;
            } else {
                // 기본이 없는 경우
                cy.get('#btnAddProductDiv').click().wait(1000);
                cy.get('.form-control').type('기본');
                cy.get('.modal-footer > .btn-primary').click();

                // 다시 '기본'이 추가되었는지 확인
                cy.get('#vueProductDivContainer').contains('기본');
            }
        });
    });

    const menuPrices = `치킨,1000`;

    it('상품 등록', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.get('#product').click(); // 상품관리 탭

        /* 메뉴 등록 */
        menuPrices
            .trim()
            .split('\n')
            .forEach(item => {
                const [menu, price] = item.trim().split(',');
                menuModule.menu(menu, price);

                /* 메뉴그룹 생성 */
                const categories = ['테스트'];

                cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn').click();
                cy.wait(1 * 1000);
                cy.get('[href="/menu/menu-group"] > .btn').click();

                categories.forEach(category => {
                    cy.get('#btnAddMenuGroup').click();
                    cy.wait(1000);
                    cy.get('#category_nm').type(category);
                    cy.get('.modal-footer > .btn-primary').click();
                    cy.get('#vueMenuGroupMain').contains(category);
                });
            });
    });

    it('옵션 등록', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 옵션 등록 */
        cy.get('[href="/menu/option"] > .btn').click();

        function registerOptionGroup(optionGroup) {
            const { size, options } = optionGroup;

            cy.get('.col-12 > .btn').click();
            cy.get('[id="OP_002"]').click(); // 다중
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

        const optionGroups = [
            {
                size: '사이드메뉴',
                options: [{ name: '테스트옵션', price: '1000' }],
            },
        ];

        optionGroups.forEach(group => {
            registerOptionGroup(group);
        });
    });

    it('메뉴 그룹 등록', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 메뉴 그룹 */
        cy.get('[href="/menu/menu-group"] > .btn').click();
        const menuGroups = {
            테스트: ['치킨'],
        };
        Object.entries(menuGroups).forEach(([group, items]) => {
            menuModule.menuGroup(group, 'App');
            cy.wait(1000);

            items.forEach(item => {
                menuModule.menuAdd(item);
            });

            cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            cy.wait(1000);
            cy.get('#global_modal_confirm').click();
        });
    });

    it('먼키앱 메뉴 등록', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 먼키앱 */
        cy.get('[href="/menu/app"] > .btn').click();
        const menuArray = menuPrices
            .trim()
            .split('\n')
            .map(line => line.split(',')[0]);

        // 역순으로 정렬
        const reversedMenuArray = menuArray.reverse();

        reversedMenuArray.forEach(text => {
            const manageOptions = text => {
                cy.contains('span', text)
                    .parents('tr')
                    .within(() => {
                        cy.get('button').eq(0).click();
                    });
                cy.wait(1 * 1000);
                cy.contains('span', '사이드메뉴')
                    .parents('tr')
                    .within(() => {
                        cy.get('button').contains('추가').click();
                    });
                cy.wait(1 * 1000);
                cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
                cy.wait(1 * 1000);
                cy.get('#global_modal_confirm').click();
                cy.wait(1 * 1000);
            };

            /* 메뉴 관리 */
            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.get('.align-middle.text-center').eq(3).contains(text).click();
                });
            cy.wait(2 * 1000);
            /* 미사용 / HOT / NEW / SALE / BEST */
            const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];
            const randomIndex = Math.floor(Math.random() * selectors.length);
            cy.get(selectors[randomIndex]).click();
            cy.wait(1 * 1000);
            cy.get('.multisteps-form__textarea').type(text); // 메뉴 설명
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

    it('테이블오더 메뉴 등록', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 테이블오더 */
        cy.get('[href="/menu/table-order/main"] > .btn').click();
        const menuArray = menuPrices
            .trim()
            .split('\n')
            .map(line => line.split(',')[0]);

        // 역순으로 정렬
        const reversedMenuArray = menuArray.reverse();

        reversedMenuArray.forEach(text => {
            /* 옵션관리 */
            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.get('button').eq(0).click();
                });
            cy.contains('span', '사이드메뉴') // 옵션명
                .parents('tr')
                .within(() => {
                    cy.get('button').contains('추가').click();
                });
            cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click(); // 추가/변경
            cy.wait(2 * 1000);
            cy.get('#global_modal_confirm').click(); // 확인
            cy.wait(2 * 1000);

            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.contains(text).click();
                });

            cy.wait(1 * 1000);
            /* 미사용 / HOT / NEW / SALE / BEST */
            const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];
            const randomIndex = Math.floor(Math.random() * selectors.length);
            cy.get(selectors[randomIndex]).click();
            cy.wait(1 * 1000);
            cy.get('.multisteps-form__textarea').type(text); // 메뉴 설명
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

    it('키오스크 메뉴 등록', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 키오스크 */
        cy.get('[href="/menu/kiosk"] > .btn').click();
        const menuArray = menuPrices
            .trim()
            .split('\n')
            .map(line => line.split(',')[0]);

        // 역순으로 정렬
        const reversedMenuArray = menuArray.reverse();

        reversedMenuArray.forEach(text => {
            const manageOptions = text => {
                cy.contains('span', text)
                    .parents('tr')
                    .within(() => {
                        cy.get('button').eq(0).click();
                    });
                cy.wait(1 * 1000);
                cy.contains('span', '사이드메뉴')
                    .parents('tr')
                    .within(() => {
                        cy.get('button').contains('추가').click();
                    });
                cy.wait(1 * 1000);
                cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
                cy.wait(1 * 1000);
                cy.get('#global_modal_confirm').click();
                cy.wait(1 * 1000);
            };

            /* 메뉴 관리 */
            cy.contains('span', text)
                .parents('tr')
                .within(() => {
                    cy.get('.align-middle.text-center').eq(3).contains(text).click();
                });
            cy.wait(2 * 1000);
            /* 미사용 / HOT / NEW / SALE / BEST */
            const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];
            const randomIndex = Math.floor(Math.random() * selectors.length);
            cy.get(selectors[randomIndex]).click();
            cy.wait(1 * 1000);
            cy.get('.multisteps-form__textarea').type(text); // 메뉴 설명
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

    it('상품, 옵션, 메뉴 그룹 삭제', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 상품 삭제 */
        cy.get(
            '[data-scroll="false"][data-mnu="/menu/*"] > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn',
        ).click();
        cy.wait(1 * 1000);
        cy.get('#product').click(); // 상품관리 탭
        cy.wait(1 * 1000);
        cy.get('#chk_all').check();
        cy.wait(1 * 1000);
        cy.get('#btnDelProduct').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.wait(1 * 1000);

        /* 옵션 삭제 */
        cy.get('[href="/menu/option"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('.btn-outline-danger').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.wait(1 * 1000);

        /* 메뉴 그룹 삭제 */
        cy.get('[href="/menu/menu-group"] > .btn').click();
        cy.wait(1 * 1000);

        cy.contains('span', '테스트')
            .parents('tr')

            .within(() => {
                cy.get('button').contains('삭제').click();
                cy.wait(1 * 1000);
            });
        cy.get('#global_modal_confirm').click();
        cy.wait(1 * 1000);
    });

    it('테이블 관리', () => {
        /* 테이블관리 */
        cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/store/main/basic"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('[href="/store/table-order/basic"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('#tableinfo').click();
        cy.wait(1 * 1000);

        cy.get('#container').then($container => {
            if ($container.text().includes('1층')) {
                cy.wait(1 * 1000);
                tableModule.table('1층', '1');
                cy.wait(1 * 1000);
            }
        });
        tableModule.ground('1층', '1');
        cy.wait(1 * 1000);
        tableModule.table('1층', '1');
        cy.wait(1 * 1000);

        cy.get('#btnTableDelete_0').click();
        cy.wait(1 * 1000);
    });

    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots);
    });

    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '사장님 사이트 기본기능',
            Screenshots,
        });
    });
});
