const { api } = require('./api.module.js');

function menu(Name, Pay, Extension, path = '', Type = undefined) {
    // 상품 등록
    cy.get('#btnAddProduct').click();
    cy.get('#productDivNo').select(1); // 상품분류

    /* 상품 이미지 */
    const fileName = `${Name}.${Extension}`;
    const dynamicPath = path ? `${path}/` : ''; // 경로가 제공되면 추가
    const filePath = `image/메뉴이미지/${dynamicPath}${fileName}`;
    const extension = fileName.split('.').pop(); // 파일 확장자 추출

    // 확장자에 따른 MIME 타입 설정
    const mimeType =
        extension === 'png'
            ? 'image/png'
            : extension === 'jpg' || extension === 'jpeg'
              ? 'image/jpeg'
              : 'application/octet-stream';
    cy.fixture(filePath, 'base64').then(fileContent => {
        cy.get('input[type="file"][id="product-img-file"]').attachFile({
            fileContent,
            filePath: filePath,
            fileName: fileName,
            mimeType: mimeType,
        });
    });
    cy.get('#PRDT_010').click(); // 품절 상태
    cy.get('#PRSS_001').click(); // 판매 상태

    if (Type === '지점') {
        cy.get('#displayMonkiYn').click(); // 노출 채널
        cy.get('#displayKioskYn').click(); // 노출 채널
    } else if (Type === '테이블오더') {
        cy.get('#displayTableorderYn').click(); // 노출 채널
    } else if (Type === '앱') {
        cy.get('#displayMonkiYn').click(); // 노출 채널
    } else {
        cy.get('#displayMonkiYn').click(); // 노출 채널
        cy.get('#displayKioskYn').click(); // 노출 채널
        cy.get('#displayTableorderYn').click(); // 노출 채널
    }

    cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type(Name); // 상품명
    cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type(Pay); // 가격

    if (['새로', '진로', '카스', '테라'].includes(Name)) {
        cy.contains('성인 인증 필요').click();
    }
    cy.get('.ms-auto').click();
    cy.wait(1 * 1000);
    cy.get('#global_modal_confirm').click();
    cy.wait(1 * 1000);
    //     cy.get('#container')
    //         .contains(Name, { timeout: 10 * 1000 })
    //         .should('be.visible');
}

function menuGroup(group, items, Type = undefined) {
    cy.contains('span', group)
        .parents('tr')
        .within(() => {
            if (Type === 'App') {
                cy.get('button').contains('관리').eq(0).click(); // 먼키앱
            } else if (Type === '키오스크') {
                cy.get('td.isMenukiosk').find('button').contains('관리').click(); // 키오스크
            } else if (Type === '테이블오더') {
                cy.get('button').contains(' 관리 ').click(); // 테이블오더
            }
        });
    cy.wait(1000);
    cy.get('#vueMenuContainer > .modal-content')
        .find('span') // 모든 span 요소를 찾음
        .filter((i, el) => items.includes(el.textContent.trim())) // 필터링: items 배열에 포함된 텍스트 찾기
        .parents('tr') // 해당하는 부모 tr을 찾음
        .each($tr => {
            // 각 tr에 대해 반복
            cy.wrap($tr).within(() => {
                // 각 tr을 래핑하여 within() 호출
                cy.contains('추가').click(); // "추가" 버튼 클릭
            });
        });

    // .parents('tr')
    // .within(() => {
    //     cy.contains('추가').click();
    // });

    cy.wait(1000);
    cy.get('#vueMenuContainer > .modal-content > .modal-footer > .bg-gradient-primary').click();
    cy.wait(1000);
    cy.get('#global_modal_confirm').click();
    cy.wait(1000);
}

function store(ID, PWD, StoreName, TableOrder) {
    cy.get(':nth-child(3) > .container-fluid > .d-flex > [href="/account/partners"] > .btn')
        .contains('계정관리')
        .click(); // 계정관리
    cy.get('[href="/account/store"] > .btn').contains('매장관리').click(); // 매장관리
    cy.get('.m-3 > .col-3 > .btn').contains('매장등록').click(); // 매장등록

    /* 매장 등록 */
    cy.get('#user-id').type(ID); // 아이디
    cy.get('#btn-check-user-id').click();
    cy.get('#user-pass').type(PWD); // 비밀번호
    cy.get('#chk-user-pass').type(PWD); // 비밀번호 확인
    cy.get('#sel-mng-partner').click(); // 대리점선택
    cy.get('#vuePartnersContainer > .modal-dialog > .modal-content > .modal-footer > .bg-gradient-primary').click();
    cy.get('#global_modal_body').contains('등록하시겠습니까?');
    cy.wait(1 * 1000);
    cy.get('#global_modal_confirm').click();
    cy.get('#store-name').type(StoreName); // 매장명

    /* 매장로고 */
    cy.fixture('image/로고이미지/번개로고.jpg', 'base64').then(fileContent => {
        cy.get('input[type="file"][id="logo-img-file"]').attachFile({
            fileContent,
            filePath: 'image/로고이미지/번개로고.jpg',
            fileName: '번개로고.jpg',
            mimeType: 'image/jpeg',
        });
    });
    cy.get('#tbo-admin-pwd').type('111111'); // 디바이스 관리자 비밀번호
    cy.get('#first-biz-category-no').select(1); // 업종 카테고리
    cy.get('#STNS_102').click();
    cy.get('#store-biz-number').type(Cypress.env('DateLabel')); // 사업자번호
    cy.get('#btn-check-store-biz-number').click();
    cy.get('#owner-name').type('강해성'); // 대표자명
    cy.get('#tel').type(Cypress.env('Phone')); // 전화번호

    // 모듈화된 API 호출
    api('경기 안양시 동안구 평촌대로 60-55').then(({ address_name, road_address_name, x, y }) => {
        // 주소 데이터를 각 입력 필드에 삽입
        cy.get('#address').invoke('val', address_name);
        cy.get('#road-address').invoke('val', road_address_name);
        cy.get('#longitude').invoke('val', x);
        cy.get('#latitude').invoke('val', y);
        cy.get('#address-detail').invoke('val', '1-1'); // 상세 주소
    });

    cy.get('#address-detail').invoke('val', '1-1'); // 상세 주소
    cy.get('#biz-email').type(Cypress.env('TestEmail')); // 이메일
    cy.get('#bank-code').select(1); // 계좌정보
    cy.get('#account-number').type(Cypress.env('DateLabel')); // 계좌번호
    cy.get('#account-user').type('예금주'); // 예금주명
    cy.get('#btn-reg-store').click();
    cy.get('#global_modal_body').contains('입력한 정보로 생성하시겠습니까?');
    cy.get('#global_modal_confirm').click();
    cy.wait(1 * 1000);

    let pageIndex = 1; // Start from page 1

    function checkStoreOnPage(pageIndex) {
        cy.get('#vueContainer').then($container => {
            const isStoreVisible =
                $container.find('span').filter((i, el) => el.textContent.trim() === StoreName).length > 0;

            if (isStoreVisible) {
                cy.contains('span', StoreName).should('be.visible'); // Check if the store is visible
                cy.log('검색 성공', StoreName);
            } else {
                cy.wait(1000); // Wait for 1 second before navigating to the next page
                cy.get('.page-item').contains(pageIndex).click(); // Click the page navigation button
                checkStoreOnPage(pageIndex + 1); // Recursively check for the store on the next page
            }
        });
    }

    checkStoreOnPage(pageIndex);

    if (TableOrder === 'Y') {
        /* 연동 정보 */
        cy.contains('span', StoreName)
            .parents('tr')
            .within(() => {
                cy.contains('관리').click();
            });
        /* 테이블오더 사용 */
        cy.get('#table_order_true').click();
        cy.get('#vueSolutionContainer > .modal-dialog > .modal-content > .modal-footer > .bg-gradient-primary').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
    }
}

module.exports = {
    store,
    menu,
    menuGroup,
};
