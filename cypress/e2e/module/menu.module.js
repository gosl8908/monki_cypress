function menu(Name, Pay) {
    const FileName = `image/메뉴이미지/${Name}.jpg`;
    /* 상품 등록 */
    cy.get('#btnAddProduct').click();
    cy.get('#productDivNo').select(1); // 상품분류

    /* 상품 이미지 */
    cy.fixture(FileName, 'base64').then(fileContent => {
        cy.get('input[type="file"][id="product-img-file"]').attachFile({
            fileContent,
            filePath: FileName,
            fileName: `${Name}.jpg`,
            mimeType: 'image/jpeg',
        });
    });
    cy.get('#PRDT_010').click(); // 품절 상태
    cy.get('#PRSS_001').click(); // 판매 상태
    cy.get('#displayMonkiYn').click(); // 노출 채널
    cy.get('#displayKioskYn').click(); // 노출 채널
    cy.get('#displayTableorderYn').click(); // 노출 채널
    cy.get(':nth-child(3) > .d-flex > .col-9 > .form-control').type(Name); // 상품명
    cy.get(':nth-child(4) > .d-flex > .col-9 > .form-control').type(Pay); // 가격

    if (['새로', '진로', '카스', '테라'].includes(Name)) {
        cy.contains('성인 인증 필요').click();
    }
    cy.get('.ms-auto').click();
    cy.wait(1 * 1000);
    cy.get('#global_modal_confirm').click();
}

function menuGroup(Name, Type = undefined) {
    cy.contains('span', Name)
        .parents('tr')
        .within(() => {
            if (Type === 'App') {
                cy.get('button').contains('메뉴 관리').eq(0).click();
            } else {
                cy.get('button').contains('메뉴 관리 ').eq(0).click();
            }
        });
}

function menuAdd(Name) {
    cy.contains('span', Name)
        .parents('tr')
        .within(() => {
            cy.get('button').contains('추가').click();
        });
}

module.exports = {
    menu: menu,
    menuGroup: menuGroup,
    menuAdd: menuAdd,
};
