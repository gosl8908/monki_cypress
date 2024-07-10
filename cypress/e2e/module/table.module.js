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
    cy.contains('span', text)
        .parents('tr')
        .within(() => {
            cy.contains('테이블 추가').click();
        });
    cy.get('#add_resource_name').type(resource_name);
    cy.get('#btnTableNameOverCheck').click();
    cy.get(
        '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
    ).click();
}

module.exports = {
    ground: ground,
    table: table,
};
