function ground(ground_name, ground_sort_order) {
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

function table(ground_name, resource_name) {
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

module.exports = {
    ground: ground,
    table: table,
};
