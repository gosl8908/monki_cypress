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
        .click(); // 클릭합니다.
    cy.wait(1 * 1000);
    cy.get('#add_resource_name').type(resource_name);
    cy.get('#btnTableNameOverCheck').click();
    cy.get(
        '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
    ).click();
    cy.wait(1 * 1000);
    // cy.contains('span', text) // '1층'이라는 텍스트를 포함하는 span을 찾습니다.
    //     .should('be.visible') // span이 화면에 보이는지 확인합니다.
    //     .parentsUntil('div.card-body') // '1층'이 포함된 span의 상위 요소를 찾습니다.
    //     .last() // 마지막으로 매칭된 부모 요소를 선택합니다.
    //     .find('div.text-center') // '테이블 추가' 버튼이 포함된 div.text-center를 찾습니다.
    //     .get('[class="fa fa-plus text-center"]') // '테이블 추가'라는 텍스트를 포함하는 요소를 찾습니다.
    //     .click(); // 버튼 클릭
    // cy.get('#add_resource_name').type(resource_name);
    // cy.get('#btnTableNameOverCheck').click();
    // cy.get(
    //     '#modalTableRegForm > .modal-dialog > #formRegGroup > .modal-content > .modal-footer > #btnGroupRegFormCheck',
    // ).click();
}

module.exports = {
    ground: ground,
    table: table,
};
