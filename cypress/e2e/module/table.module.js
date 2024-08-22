function ground(ground_name, ground_sort_order) {
    /* 구역 추가 */
    cy.get('#btnSerialAdd').click();
    cy.get('#add_ground_name').type(ground_name);
    cy.get('#add_ground_sort_order').type(ground_sort_order);
    cy.get(
        '#modalGroupRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
    ).click();
}
function table(text, resource_name) {
    /* 테이블추가 */
    cy.contains('div', text) // '1층'을 포함하는 div 요소를 찾습니다.
        .closest('div.card-body') // 'card-body' 클래스가 있는 가장 가까운 부모 div 요소를 찾습니다.
        .find('.fa-plus') // 'card-body' 클래스 내의 fa-plus 클래스를 가진 아이콘을 찾습니다.
        .click();
    cy.wait(1 * 1000);
    cy.get('#add_resource_name').type(resource_name);
    cy.get('#btnTableNameOverCheck').click();
    cy.get(
        '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
    ).click();
    cy.wait(1 * 1000);
}

module.exports = {
    ground: ground,
    table: table,
};
