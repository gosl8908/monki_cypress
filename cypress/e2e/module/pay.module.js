function pay({ PgCompany, Type, MidType, Mid, Key, EasyId = undefined, Tid = undefined, VanTid = undefined }) {
    cy.get('#store_biz_number').type(Cypress.env('DateLabel')); // 사업자번호
    cy.wait(1 * 1000);
    cy.get('#pg_company').select(PgCompany); // PG 업체 // 1:스마트로, 2:KIS, 3:KOVEN

    cy.get('#payment_type').select(Type); // 결제분류
    // 스마트로 : 1.먼키앱, 2.VAN
    // KIS : 1.먼키앱, 2.OFF-PG, 3.VAN, 4.PG(VAN)
    // KOVAN : 1.먼키앱, 2.OFF-PG, 3.VAN, 4.PG(VAN)

    cy.get('#pg_mid_type').select(MidType); // 결제유형
    // 1. 신용카드, 2. 카드등록 간편결제(인증), 3. 카드등록 간편결제(비인증)

    /* Type이 OFF-PG인 경우 Tid 입력*/
    if (Type === 'OFF-PG') {
        cy.get('#pay_name').type('테이블오더');
        cy.get('#pg_offpg_tid').type(Tid);
    } else if (Type === 'PG(VAN)') {
        /* Type이 PG(VAN)인 경우 VanTid 입력 */
        cy.get('#pay_name').type('테이블오더');
        cy.get('#pg_offpg_tid').type(Tid);
        cy.get('#pg_van_tid').type(VanTid);
    } else if (Type === 'VAN') {
        cy.get('#pay_name').type('테이블오더');
        cy.get('#pg_van_tid').type(Tid);
    }
    /* MidType이 간편결제인 경우 EasyId 입력 */
    if (MidType === '카드등록 간편결제(인증)') {
        cy.get('#pg_bill_mid').type(EasyId);
    }

    if (Type != 'VAN') {
        cy.get('#pg_mid').type(Mid); // PG MID
        cy.get('#pg_merchant_key').type(Key); // PG 상점키
    }
    cy.get('#store_contract_device').select(2); // 계약 설정
    cy.contains('연동하기').click();

    cy.get('#global_modal_body').contains('등록 하시겠습니까?');
    cy.wait(1 * 1000);
    cy.get('#global_modal_confirm').click();
    cy.get('#vuePayContainer > .modal-dialog > .modal-content > #modal_body').contains(PgCompany);
}
module.exports = {
    pay: pay,
};
