// const { apiModule } = require('../module/manager.module.js');

function store(ID, PWD, StoreName, TableOrder, address_name, road_address_name, x, y) {
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

    // 주소 데이터를 각 입력 필드에 삽입
    cy.get('#address').invoke('val', address_name);
    cy.get('#road-address').invoke('val', road_address_name);
    cy.get('#longitude').invoke('val', x);
    cy.get('#latitude').invoke('val', y);
    // });

    cy.get('#address-detail').invoke('val', '1-1'); // 상세 주소
    cy.get('#biz-email').type(Cypress.env('TestEmail')); // 이메일
    cy.get('#bank-code').select(1); // 계좌정보
    cy.get('#account-number').type(Cypress.env('DateLabel')); // 계좌번호
    cy.get('#account-user').type('예금주'); // 예금주명
    cy.get('#btn-reg-store').click();
    cy.get('#global_modal_body').contains('입력한 정보로 생성하시겠습니까?');
    cy.get('#global_modal_confirm').click();
    cy.wait(1 * 1000);

    cy.contains(StoreName).should('be.visible', { timeout: 5 * 1000 });

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
};
