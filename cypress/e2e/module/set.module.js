function TimeSet(StoreName) {
    /* 영업시간 */
    cy.get('#operation').click();
    cy.wait(1 * 1000);

    cy.get('#operation-store-no').select(StoreName);
    cy.wait(1 * 1000);
    cy.contains('전환').click();

    /* 평일 */
    cy.get(':nth-child(1) > .p-0 > :nth-child(1) > .card-header > .btn').click();
    cy.get(':nth-child(2) > :nth-child(1) > .form-select').select('오전 0시');
    cy.get(':nth-child(2) > :nth-child(2) > .form-select').select('0분');
    cy.get(':nth-child(2) > :nth-child(4) > .form-select').select('오후 11시');
    cy.get(':nth-child(2) > :nth-child(5) > .form-select').select('30분');
    /* 주말 */
    cy.get(':nth-child(4) > :nth-child(1) > .form-select').select('오전 0시');
    cy.get(':nth-child(4) > :nth-child(2) > .form-select').select('0분');
    cy.get(':nth-child(4) > :nth-child(4) > .form-select').select('오후 11시');
    cy.get(':nth-child(4) > :nth-child(5) > .form-select').select('30분');
    cy.get('#vueTimeContainer > .modal-dialog > .modal-content > .modal-footer > .d-flex > :nth-child(1)').click(); // 모든 솔루션 적용
    cy.wait(1 * 1000);
    cy.get('#global_modal_confirm').click(); // 확인

    /* 정기휴무일 */
    cy.get(':nth-child(2) > .p-0 > .card > .card-header > .btn').click();
    cy.get(
        '#vueCloseContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(1) > .form-select',
    ).select('매월 첫째'); // 매월 첫째
    cy.get(
        '#vueCloseContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(2) > .form-select',
    ).select('일요일'); // 일요일
    cy.get('#vueCloseContainer > .modal-dialog > .modal-content > .modal-footer > .bg-gradient-primary').click(); // 적용
    cy.wait(1 * 1000);
    cy.get('#global_modal_confirm').click(); // 확인

    /* 휴게시간 */
    cy.get(':nth-child(4) > .p-0 > :nth-child(1) > .card-header > .btn').click();
    cy.get(
        '#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(1) > .form-select',
    ).select('낮 12시');
    cy.get(
        '#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(2) > .form-select',
    ).select('30분');

    cy.get(
        '#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(4) > .form-select',
    ).select('오후 1시');
    cy.get(
        '#vueBreaktimeContainer > .modal-dialog > .modal-content > #modal_body > .row > .col-12 > .card > .card-body > .d-flex > :nth-child(5) > .form-select',
    ).select('30분');

    cy.get('#vueBreaktimeContainer > .modal-dialog > .modal-content > .modal-footer > .d-flex > :nth-child(1)').click(); // 모든 솔루션 적용
    cy.wait(1 * 1000);
    cy.get('#global_modal_confirm').click(); // 확인
}

function groundSet(StoreName, ground_name, ground_sort_order) {
    cy.get('[href="/store/table-order/basic"] > .btn').click();
    cy.get('#tableinfo').click();
    cy.wait(1 * 1000);

    cy.get('#basic-store-no').select(StoreName);
    cy.wait(1 * 1000);
    cy.contains('전환').click();

    /* 구역 추가 */
    cy.get('#btnSerialAdd').click(); // 구역 추가
    cy.wait(1 * 1000);
    cy.get('#add_ground_name').type(ground_name); // 구역 명칭
    cy.wait(1 * 1000);
    cy.get('#add_ground_sort_order').type(ground_sort_order); // 구역 순서
    cy.wait(1 * 1000);
    cy.get(
        '#modalGroupRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck', // 추가
    ).click();
    cy.wait(1 * 1000);
    cy.get('#container')
        .contains(ground_name, { timeout: 10 * 1000 })
        .should('be.visible');
}

function tableSet(StoreName, ground_name, resource_name) {
    cy.get('[href="/store/table-order/basic"] > .btn').click();
    cy.get('#tableinfo').click();
    cy.wait(1 * 1000);

    cy.get('#basic-store-no').select(StoreName);
    cy.wait(1 * 1000);
    cy.contains('전환').click();

    /* 테이블추가 */
    cy.contains('div', ground_name) // 구역에서 테이블 추가
        .closest('div.card-body')
        .find('.fa-plus')
        .click();
    cy.wait(1 * 1000);
    cy.get('#add_resource_name').type(resource_name); // 테이블 명칭
    cy.wait(1 * 1000);
    cy.get('#btnTableNameOverCheck').click(); // 중복 체크
    cy.wait(1 * 1000);
    cy.get(
        '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck', // 추가/변경
    ).click();
    cy.wait(1 * 1000);
    cy.get('#container')
        .contains(resource_name, { timeout: 10 * 1000 })
        .should('be.visible');
}

function cuponSet(StoreName) {
    cy.get(':nth-child(3) > .container-fluid > .d-flex').contains('운영관리').click();
    cy.get('[style="display: block;"] > .container-fluid > .d-flex').contains('쿠폰관리').click();
    cy.wait(1 * 1000);

    cy.get('#coupon-store-no').select(StoreName);
    cy.wait(1 * 1000);
    cy.contains('전환').click();

    cy.get('.col-12 > .btn').contains('쿠폰 등록').click();

    /* 쿠폰 정보 */
    cy.get('#coupon_nm').type(Cypress.env('Date') + ' 쿠폰테스트'); // 쿠폰명
    cy.get('#coupon_price').type('10000'); // 쿠폰 할인 금액
    cy.wait(1 * 1000);
    cy.get('#min_order_price').type('5000'); // 최소 주문 금액
    cy.wait(1 * 1000);
    cy.get('#page_modal_confirm').contains('적용').click();
    cy.wait(1 * 1000);
    cy.get('#global_modal_confirm').contains('확인').click();
    cy.wait(1 * 1000);

    cy.get('#container')
        .contains(Cypress.env('Date'))
        .should('be.visible', { timeout: 5 * 1000 });
}

module.exports = {
    TimeSet,
    groundSet,
    tableSet,
    cuponSet,
};
