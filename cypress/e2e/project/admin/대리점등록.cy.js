const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('Onprem Dashboard Test', () => {
    let TestFails = []; // 실패 원인을 저장할 변수
    let Screenshots = []; // 스크린샷을 저장할 배열
    let Failure = false;
    Cypress.on('fail', (err, runnable) => {
        const ErrMessage = err.message || '알 수 없는 이유로 실패함';
        !TestFails.includes(ErrMessage) && TestFails.push(ErrMessage);
        Failure = true;
        throw err;
    });
    beforeEach(() => {
        cy.setDateToEnv();
        cy.getAll();
        loginModule.login({
            Site: `${Cypress.env('StgAdmin')}`,
            Id: `${Cypress.env('AdminId')}`,
            Password: `${Cypress.env('TestPwd')}`,
        });
    });

    it('Ceo Page Test', () => {
        cy.get('[data-mnu="/franchise-partner/*,/pg-trans-excel/*"] > [href="#"]').click();
        cy.get('.menu-open > .nav > :nth-child(1) > .nav-link > p').click();
        cy.get('#btnAddAgency').click();
        cy.get(':nth-child(1) > .input-group > .form-control').type(Cypress.env('TestId5'));
        cy.get(
            '#vueAgencyModal > .modal-dialog > .modal-content > .modal-body > .row > .col-12 > .card > .card-body > :nth-child(1)',
        )
            .contains('중복체크')
            .click();

        cy.get('.card-body > :nth-child(2) > .form-control').type('gotjd0215!');
        cy.get(':nth-child(3) > .input-group > .form-control').type('gotjd0215!');
        cy.get(':nth-child(6) > .input-group > :nth-child(1) > label').click(); // 스마트로
        // cy.get(':nth-child(5) > .input-group > :nth-child(2) > label').click();
        // cy.get(':nth-child(5) > .input-group > :nth-child(4) > label').click();
        cy.get('[name="partner_name"]').type('몬키'); // 사업자명
        cy.get('[name="biz_number"]').type('53424234234');
        cy.get('[id="btnCheckBizNum"]').click();
        cy.get('[name="owner_name"]').type('강해성');
        cy.get('[name="tel"]').type('01020431653');
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
        const apiKey = '419ed37eb9960d76f12d9ff0610d327a';
        const query = encodeURIComponent('경기 안양시 동안구 평촌대로 60-55');

        const url = `http://dapi.kakao.com/v2/local/search/address.json?query=${query}&page=1&size=10`;

        cy.request({
            method: 'GET',
            url: url,
            headers: {
                Accept: '*/*',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5',
                Authorization: `KakaoAK ${apiKey}`,
                Host: 'dapi.kakao.com',
                ka: 'sdk/4.4.15 os/javascript lang/ko-KR device/Win32 origin/http%3A%2F%2Fstaging-mngr.monthlykitchen.kr',
                Origin: 'http://staging-mngr.monthlykitchen.kr',
                Referer: 'http://staging-mngr.monthlykitchen.kr/',
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
        }).then(response => {
            // 응답을 검증하거나 필요한 테스트를 진행
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('documents');
            expect(response.body).to.have.property('meta');

            /* 주소 입력 */
            const addressNames = response.body.documents.map(document => document.road_address.address_name);
            cy.get('[name="road_address"]').invoke('val', addressNames.join(', '));
            const zipcode = response.body.documents.map(document => document.road_address.zone_no);
            cy.get('[name="zipcode"]').invoke('val', zipcode.join(', '));
            cy.window().then(window => {
                const element = window.document.getElementById('vueAgencyModal');
                cy.log(element);
                window.Vue && element.__vue__._data.form;
                const vueInstance = element.__vue__._data.form;

                cy.log(vueInstance);
                vueInstance.road_address = addressNames[0]; // road_address 값 입력 대괄호 생략

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
                cy.get('#vueAgencyModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
            });
        });
    });
});

//   cy.get('#global_modal_body').contains('입력한 내용으로 등록하시겠습니까?');
//   cy.get('#global_modal_confirm').click();

// afterEach('Status Check', () => {
//     if (Failure) {
//         const ScreenshotFileName = `Ceo Page Test ${Cypress.env('DateLabel')}`;
//         cy.screenshot(ScreenshotFileName);
//         if (!Cypress.platform.includes('win')) {
//             const CurrentFile = f.getFileName(__filename);
//             Screenshots.push(`${CurrentFile}/${ScreenshotFileName}`);
//         } else {
//             Screenshots.push(`${ScreenshotFileName}`);
//         }
//         Failure = false;
//     }
// });
// after('Send Email', () => {
//     const TestRange =
//         '1. 사장님 페이지 로그인';
//     emailModule.email({
//         TestFails: TestFails,
//         EmailTitle: `[${Cypress.env('EmailTitle')}]`,
//         TestRange: TestRange,
//         Screenshots: Screenshots,
//     });
// });
