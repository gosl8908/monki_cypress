const { loginModule, emailModule, apiModule } = require('../../module/manager.module.js');

describe('대리점 등록', () => {
    let Screenshots = []; // 스크린샷을 저장할 배열
    let TestFails = []; // 실패 원인을 저장할 변수
    let FailureObj = { Failure: false };
    let FailedTests = []; // 실패한 테스트 정보를 저장할 배열
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        cy.err(TestFails, FailedTests, FailureObj);
        loginModule.login({
            Site: `${Cypress.env('Admin')}`,
            Id: `${Cypress.env('AdminId')}`,
            Password: `${Cypress.env('AdminPwd')}`,
        });
    });

    it('Agency create', () => {
        cy.get('.sidebar').contains('협력사 관리').click();
        cy.get('.sidebar').contains('대리점 관리').click();
        cy.get('#btnAddAgency').contains('대리점 등록').click();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.env('StoreTestId')[1]);
        cy.get(
            '#vueAgencyModal > .modal-dialog > .modal-content > .modal-body > .row > .col-12 > .card > .card-body > :nth-child(1)',
        )
            .contains('중복체크')
            .click();

        cy.get('.card-body > :nth-child(2) > .form-control').type(Cypress.env('AdminPwd'));
        cy.get(':nth-child(3) > .input-group > .form-control').type(Cypress.env('AdminPwd'));
        cy.get(':nth-child(6) > .input-group > :nth-child(1) > label').click(); // 스마트로
        cy.get(':nth-child(6) > .input-group > :nth-child(2) > label').click(); // KIS
        cy.get(':nth-child(6) > .input-group > :nth-child(3) > label').click(); // KICC
        cy.get(':nth-child(6) > .input-group > :nth-child(4) > label').click(); // KOVAN
        // cy.get(':nth-child(5) > .input-group > :nth-child(2) > label').click();
        // cy.get(':nth-child(5) > .input-group > :nth-child(4) > label').click();
        cy.get('[name="partner_name"]').type('몬키'); // 사업자명
        cy.get('[name="biz_number"]').type(Cypress.env('DateLabel'));
        cy.get('[id="btnCheckBizNum"]').click();
        cy.get('[name="owner_name"]').type('강해성');
        cy.get('[name="tel"]').type(Cypress.env('Phone'));
        cy.get('[name="address_detail"]').type('1');
        // cy.contains('주소검색').click();
        // // 동적으로 iframe의 ID를 가져옴
        // cy.get('iframe[id^="__daum__viewerFrame_"]').then($iframe => {
        //     const iframeId = $iframe.attr('id');

        //     // 가져온 ID를 사용하여 iframe이 로드될 때까지 기다림
        //     cy.frameLoaded(`#${iframeId}`, { timeout: 10000 });

        //     // iframe 내부의 요소 선택 및 동작 수행
        //     cy.iframe().find('.post_search', { timeout: 10000 }).type('test');
        // });

        // 모듈화된 API 호출
        apiModule
            .api('경기 안양시 동안구 평촌대로 60-55')
            .then(({ address_name, road_address_name, x, y, zipcode }) => {
                // 주소 데이터를 각 입력 필드에 삽입
                cy.get('[name="road_address"]').invoke('val', address_name);
                cy.log('address:', address_name);
                cy.log('road_address:', road_address_name);
                cy.get('[name="zipcode"]').invoke('val', zipcode);

                cy.window().then(window => {
                    const element = window.document.getElementById('vueAgencyModal');
                    cy.log(element);
                    window.Vue && element.__vue__._data.form;
                    const vueInstance = element.__vue__._data.form;

                    cy.log(vueInstance);
                    vueInstance.road_address = address_name; // road_address 값 입력 대괄호 생략
                    // vueInstance.road_address = addressNames[0]; // road_address 값 입력 대괄호 생략

                    cy.log('partner_no: ', vueInstance.partner_no);
                    cy.log('parent_partner_no: ', vueInstance.parent_partner_no);
                    cy.log('user_id: ', vueInstance.user_id);
                    cy.log('is_checked_id: ', vueInstance.is_checked_id);
                    cy.log('user_pwd: ', vueInstance.user_pwd);
                    cy.log('check_user_pwd: ', vueInstance.check_user_pwd);
                    cy.log('is_checked_pwd: ', vueInstance.is_checked_pwd);
                    cy.log('pos_partner_type: ', vueInstance.pos_partner_type);
                    cy.log('partner_name: ', vueInstance.partner_name);
                    cy.log('biz_number: ', vueInstance.biz_number);
                    cy.log('is_checked_biz_num: ', vueInstance.is_checked_biz_num);
                    cy.log('sub_biz_number: ', vueInstance.sub_biz_number);
                    cy.log('owner_name: ', vueInstance.owner_name);
                    cy.log('tel: ', vueInstance.tel);
                    cy.log('zipcode: ', vueInstance.zipcode);
                    cy.log('road_address: ', vueInstance.road_address);
                    cy.log('address_detail: ', vueInstance.address_detail);
                    cy.log('valid_status: ', vueInstance.valid_status);
                    cy.log('memo: ', vueInstance.memo);
                    cy.log('road_address', vueInstance.road_address);
                    cy.log('zipcode', vueInstance.zipcode);
                });
            });
        cy.get('#vueAgencyModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
        cy.get('#global_modal_body').contains('입력한 내용으로 등록하시겠습니까?');
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
    });

    afterEach('Status Check', function () {
        emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    });
    after('Send Email', function () {
        const { title: describeTitle, tests: allTests } = this.test.parent; // describe의 제목과 모든 테스트를 한 번에 가져오기

        emailModule.email({
            TestFails,
            describeTitle,
            EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
            TestRange: '대리점 등록' + `\n${allTests.map((test, index) => `${index + 1}. ${test.title}`).join('\n')}`,
            Screenshots,
            currentTest: FailedTests,
        });
    });
});
