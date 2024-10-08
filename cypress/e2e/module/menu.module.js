function menu(Name, Pay, Extension, Type = undefined) {
    // 상품 등록
    cy.get('#btnAddProduct').click();
    cy.get('#productDivNo').select(1); // 상품분류

    /* 상품 이미지 */
    const fileName = `${Name}.${Extension}`;
    const filePath = `image/메뉴이미지/${fileName}`;
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

module.exports = {
    menu: menu,
    menuGroup,
};
