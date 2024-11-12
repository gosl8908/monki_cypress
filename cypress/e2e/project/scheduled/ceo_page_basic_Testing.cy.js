const { loginModule, emailModule, menuModule, tableModule } = require('../../module/manager.module.js');

describe('Scheduled ceo page basic Testing', () => {
    let TestFails = []; // 실패 원인을 저장할 변수
    let Screenshots = []; // 스크린샷을 저장할 배열
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `${Cypress.env('StgCeo')}`,
            Type: '단골맛집 가맹점주',
            Id: `${Cypress.env('FavTestId')[2]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    it('Login', () => {
        cy.get('[href="/users/logout"]').click();
        loginModule.login({
            Site: `${Cypress.env('StgCeo')}`,
            Type: '대리점',
            Id: `${Cypress.env('StoreTestId')[0]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
        cy.get('[href="/users/logout"]').click();
        loginModule.login({
            Site: `${Cypress.env('StgCeo')}`,
            Type: '사장님',
            Id: `${Cypress.env('CeoTestId')[0]}`,
            Password: `${Cypress.env('TestPwd2')}`,
        });
    });

    it('Hours changed', () => {
        cy.contains('단골맛집', { timeout: 1 * 1000 });
        cy.get('#operation', { timeout: 1 * 1000 }).click();
        cy.wait(1 * 1000);
        cy.get(':nth-child(1) > .p-0 > :nth-child(1) > .card-header > .btn').click();
        cy.get(':nth-child(2) > :nth-child(1) > .form-select').select('오전 1시');
        cy.get(':nth-child(2) > :nth-child(4) > .form-select').select('오후 11시');
        cy.get('#vueTimeContainer > .modal-dialog > .modal-content > .modal-footer > .d-flex > :nth-child(1)').click();
        cy.contains('먼키 솔루션의 모든 영업시간을 변경하시겠습니까?')
            .should('be.visible', { timeout: 3 * 1000 })
            .get('#global_modal_confirm')
            .wait(1 * 1000)
            .click();
    });

    it('Edit App Information', () => {
        /* 앱정보 */
        cy.get('[href="/store/monki"] > .btn').click();

        cy.get('.card-body > :nth-child(1) > .form-control')
            .clear()
            .type(`자동화 테스트 ${Cypress.env('DateLabelWeek')}`);
        cy.get('.card-body > :nth-child(2) > .form-control')
            .clear()
            .type(`자동화 테스트 ${Cypress.env('DateLabelWeek')}`);
        cy.get('.card-body > :nth-child(3) > .form-control')
            .clear()
            .type(`자동화 테스트 ${Cypress.env('DateLabelWeek')}`);
        cy.get('.card-header > .btn').click();
        cy.get('#global_modal_body').contains('적용하시겠습니까?').should('be.visible');
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        /* 주문설정 */
        cy.get('#set-order-tab').click();

        cy.get('.col-9 > :nth-child(1) > .form-control').clear().type('0');
        cy.get('.col-9 > :nth-child(3) > .form-control').clear().type('30');
        cy.get(':nth-child(2) > .col-auto > .form-check-input').click();
        cy.get(':nth-child(3) > :nth-child(2) > .form-check-input').click();
        cy.get(':nth-child(4) > .col-auto > .form-check-input').click();
        cy.get(':nth-child(4) > .form-check-input').click();
        cy.get('#global_info_modal_container > .modal-dialog > .modal-content > .modal-header')
            .contains('시간 예약 주문 상태 변경')
            .should('be.visible');
        cy.wait(1 * 1000);
        cy.get('#global_info_modal_cancel_confirm').click();
        cy.get('#basic-detail-section > .p-3 > .card > .card-footer > .btn').click();
        cy.get('#global_modal_body').contains('변경하시겠습니까?').should('be.visible');
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        /* 영업 일시중지 */
        cy.get('#pause-tab').click();

        cy.get('#pause-detail-section > .p-3 > .card > .card-footer > :nth-child(1)').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();

        cy.wait(1 * 1000);
        cy.get('#pause-detail-section > .p-3 > .card > .card-body').contains('일시중지').should('be.visible');
        cy.get('#pause-detail-section > .p-3 > .card > .card-footer > :nth-child(1)').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.wait(1 * 1000);
    });

    it('Menu Management', () => {
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

    it('Management TableOrder', () => {
        cy.get('[data-mnu="/store/table-order,/store/table-order/*"]').click();

        /* 대기이미지 */
        cy.fixture('image/로고이미지/default.jpg', 'base64').then(fileContent => {
            cy.get('input[type="file"][id="ready_img_file"]').attachFile({
                fileContent,
                filePath: 'image/로고이미지/default.jpg',
                fileName: 'default.jpg',
                mimeType: 'image/jpeg',
            });
        });
        cy.wait(1 * 1000);
        cy.get('.col-4 > #btnReadyImgSave').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').contains('확인').click({ force: true });
        cy.wait(1 * 1000);

        /* 삭제 */
        cy.get('#container')
            .contains('span', '2')
            .parents('tr')
            .within(() => {
                cy.get('button').contains('삭제').click({ force: true });
            });
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').contains('확인').click({ force: true });
        cy.wait(1 * 1000);
        cy.get('.col-4 > #btnReadyImgSave').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').contains('확인').click({ force: true });
        cy.wait(1 * 1000);

        /* 테이블 구역 추가  */
        cy.get('[href="/store/table-order/basic"] > .btn').click();
        cy.get('#tableinfo').click();
        cy.get('#btnSerialAdd').click();
        cy.wait(1 * 1000);
        cy.get('#add_ground_name').type('테스트');
        cy.get('#add_ground_sort_order').type('3');
        cy.wait(1 * 1000);
        cy.get(
            '#modalGroupRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        ).click();

        cy.get('.main-content').contains('테스트');

        /* 테이블 추가 */
        cy.get('#divGroundResourceTableView_0 > .border > .tableorder-center-text > a').click();
        cy.wait(1 * 1000);
        cy.get('#add_resource_name').type('테스트');
        cy.get('#btnTableNameOverCheck').click();
        cy.wait(1 * 1000);

        cy.get(
            '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
        ).click();

        /* 테이블 삭제 */
        cy.get(
            '#divGroundResourceTableView_0 > .mb-1 > .height-200 > .text-center > :nth-child(2) > #btnTableDelete_0',
        ).click();
        cy.wait(1 * 1000);

        /* 구역 삭제 */
        cy.get('#btnGroupDelete_0').contains('구역 삭제하기').click();
        cy.get('#global_modal_body').contains('삭제하시겠습니까?');
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
    });
    const menuPrices = `테스트,1000,테스트`;

    it('Product Create', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.get('#product').click(); // 상품관리 탭

        /* 메뉴 등록 */
        menuPrices
            .trim()
            .split('\n')
            .forEach(item => {
                const [menu, price] = item.trim().split(',');
                menuModule.menu(menu, price, 'png');
            });
    });

    it('Menu Group Create', () => {
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

    it('Option Create', () => {
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

        const optionPrices = `
        테스트,1000
        `;
        const optionsArray = optionPrices
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
            테스트: menuNames,
        };
        Object.entries(menuGroups).forEach(([group, items]) => {
            menuModule.menuGroup(group, items, 'App');
            cy.wait(1000);
            menuModule.menuGroup(group, items, '테이블오더');
            cy.wait(1000);
            // menuModule.menuGroup(group, items, '키오스크');
            // cy.wait(1000);
        });
    });

    it('App Menu Create', () => {
        /* 먼키앱 메뉴 관리*/
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        cy.get('[href="/menu/app"] > .btn').click();

        const menuArray = menuPrices
            .trim()
            .split('\n')
            .map(line => line.split(',')[0].trim());

        // 역순으로 정렬
        const reversedMenuArray = menuArray.reverse();

        reversedMenuArray.forEach(text => {
            /* 옵션관리 */
            cy.get('span')
                .filter((i, el) => el.textContent.trim() === text)
                .parents('tr')
                .within(() => {
                    cy.get('button').eq(0).click();
                });
            cy.wait(1 * 1000);
            cy.get('#vueOptionContainer > .modal-content > .modal-body')
                .contains('span', '사이드메뉴')
                .parents('tr')
                .within(() => {
                    cy.get('button').contains('추가').click();
                });
            cy.wait(1 * 1000);
            cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
            cy.wait(1 * 1000);
            cy.get('#global_modal_confirm').click();
            cy.wait(1 * 1000);

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

    it('TableOrder Menu Create', () => {
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
                                    .filter(
                                        (i, el) => el.textContent.trim() === menu && el.classList.contains('clickable'),
                                    )
                                    .click();
                            });
                        cy.wait(1 * 1000);
                        /* 미사용 / HOT / NEW / SALE / BEST */
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

    it('TableOrder Staff Call Setup', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 테이블오더 */
        cy.get('[href="/menu/table-order/main"] > .btn').click();
        cy.wait(1 * 1000);

        cy.get('#employee').click();
        cy.wait(1 * 1000);
        cy.get('#btnEmployeeAdd').click();
        cy.wait(1 * 1000);
        cy.get('#add_ItemName').type('물');
        cy.wait(1 * 1000);
        cy.get('#btnItemNameCheck').click();
        cy.wait(1 * 1000);
        cy.get('#btnItemFormCheck').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click({ force: true });
        cy.wait(1 * 1000);
        cy.get('#container')
            .contains('물', { timeout: 3 * 1000 })
            .should('be.visible');
    });

    // it('키오스크 메뉴 등록', () => {
    //     cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
    //     /* 키오스크 */
    //     cy.get('[href="/menu/kiosk"] > .btn').click();
    //     const menuArray = menuPrices
    //         .trim()
    //         .split('\n')
    //         .map(line => line.split(',')[0])
    //         .trim();

    //     // 역순으로 정렬
    //     const reversedMenuArray = menuArray.reverse();

    //     reversedMenuArray.forEach(text => {
    //         /* 옵션관리 */
    //         cy.get('span')
    //             .filter((i, el) => el.textContent.trim() === text)
    //             .parents('tr')
    //             .within(() => {
    //                 cy.get('button').click();
    //             });
    //         cy.wait(1 * 1000);
    //         cy.contains('span', '사이드메뉴')
    //             .parents('tr')
    //             .within(() => {
    //                 cy.get('button').contains('추가').click();
    //             });
    //         cy.wait(1 * 1000);
    //         cy.get('#vueOptionContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
    //         cy.wait(1 * 1000);
    //         cy.get('#global_modal_confirm').click();
    //         cy.wait(1 * 1000);

    //         /* 상품관리 */
    //         cy.get('span')
    //             .filter((i, el) => el.textContent.trim() === text) // 정확히 일치하는 텍스트 필터링
    //             .parents('tr')
    //             .within(() => {
    //                 cy.get('span') // 클릭할 요소도 정확히 일치하는 텍스트 찾기
    //                     .filter((i, el) => el.textContent.trim() === text)
    //                     .click();
    //             });
    //         cy.wait(1 * 1000);

    //         /* 미사용 / HOT / NEW / SALE / BEST */
    //         const selectors = ['#MNBG_000', '#MNBG_101', '#MNBG_102', '#MNBG_103', '#MNBG_104'];
    //         const randomIndex = Math.floor(Math.random() * selectors.length);
    //         cy.get(selectors[randomIndex]).click();
    //         cy.wait(1 * 1000);
    //         cy.get('.multisteps-form__textarea').type(text); // 메뉴 설명
    //         cy.wait(1 * 1000);
    //         cy.get('#MN_001').click(); // 앱 노출 여부
    //         cy.wait(1 * 1000);
    //         cy.get('.ms-auto').click(); // 변경하기
    //         cy.wait(1 * 1000);
    //         cy.get('#global_modal_confirm').click(); // 확인
    //         cy.wait(1 * 1000);
    //         cy.go('back');
    //     });
    // });

    it('Product Delete', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 상품 삭제 */
        cy.get(
            '[data-scroll="false"][data-mnu="/menu/*"] > .container-fluid > .d-flex > [href="/menu/product-div"] > .btn', // 상품관리
        ).click();
        cy.wait(1 * 1000);
        cy.get('#product').click(); // 상품관리 탭
        cy.wait(1 * 1000);
        cy.get('.main-content').then($container => {
            if ($container.text().includes('테스트')) {
                cy.get('.main-content')
                    .contains('span', '테스트')
                    .parents('tr')
                    .within(() => {
                        cy.get('[id="chk_product_yn_0"]').click({ force: true });
                    });
                cy.wait(1 * 1000);
                cy.get('#btnDelProduct').click();
                cy.wait(1 * 1000);
                cy.get('#global_modal_confirm').click();
                cy.wait(1 * 1000);
            }
        });
    });
    it('Option Delete', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 옵션 삭제 */
        cy.get('[href="/menu/option"] > .btn').click();
        cy.wait(1 * 1000);

        cy.get('.main-content').then($container => {
            if (!$container.text().includes('조회결과가 없습니다.')) {
                cy.get('.btn-outline-danger').eq(0).click();
                cy.wait(1 * 1000);
                cy.get('#global_modal_confirm').click();
                cy.wait(1 * 1000);
            }
        });
    });
    it('Menu Group Delete', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 메뉴 그룹 삭제 */
        cy.get('[href="/menu/menu-group"] > .btn').click();
        cy.wait(1 * 1000);

        cy.get('.main-content').then($container => {
            if ($container.text().includes('테스트')) {
                cy.contains('span', '테스트')
                    .parents('tr')

                    .within(() => {
                        cy.get('button').contains('삭제').click();
                        cy.wait(1 * 1000);
                    });
                cy.get('#global_modal_confirm').click();
                cy.wait(1 * 1000);
            }
        });
    });

    it('Staff Call Delete', () => {
        cy.get('[name="gnb-menu"]').contains('메뉴관리').click();
        /* 직원 호출 삭제 */
        cy.get('[href="/menu/table-order/main"] > .btn').click();
        cy.wait(1 * 1000);
        cy.get('#employee').click();
        cy.wait(1 * 1000);

        cy.get('.main-content').then($container => {
            if ($container.text().includes('물')) {
                cy.contains('td', '물')
                    .parents('tr')
                    .within(() => {
                        cy.get('button').contains('삭제').click();
                        cy.wait(1 * 1000);
                    });
                cy.get('#global_modal_confirm').click({ force: true });
                cy.wait(1 * 1000);
            }
        });
    });

    it('Sales Status', () => {
        cy.get('[href="/sales/monki/main"] > .btn').click();

        cy.get('#container').contains('전체매출 현황').should('be.visible');

        cy.get('[href="/sales/renew/monkiapp"] > .btn').click();
        cy.get('#container').contains('앱 일자/기간별 매출 현황').should('be.visible');

        cy.get('[href="/sales/renew/tableorder"] > .btn').click();
        cy.get('#container').contains('후불결제 사용 매장은 POS에서 매출 확인이 가능합니다.').should('be.visible');
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
                '사장님 사이트 기본기능' +
                `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
