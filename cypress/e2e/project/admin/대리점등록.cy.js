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
        cy.get(':nth-child(1) > .input-group > .form-control').type('Test' + Cypress.env('DateLabel'));
        cy.get(
            '#vueAgencyModal > .modal-dialog > .modal-content > .modal-body > .row > .col-12 > .card > .card-body > :nth-child(1)',
        )
            .contains('중복체크')
            .click();

        cy.get('.card-body > :nth-child(2) > .form-control').type('gotjd0215!');
        cy.get(':nth-child(3) > .input-group > .form-control').type('gotjd0215!');
        cy.get(':nth-child(6) > .input-group').contains('스마트로').click();
        cy.get(':nth-child(7) > .form-control').type('Test' + Cypress.env('DateLabel'));
        cy.get(':nth-child(8) > .input-group > .form-control').type(Cypress.env('DateLabel'));
        cy.get('.card-body > :nth-child(8)').contains('중복체크').click();
        cy.get(':nth-child(10) > .form-control').type('QA');
        cy.get(':nth-child(11) > .form-control').type('01020431653');
        cy.get(':nth-child(13) > .form-control').type('1');
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
            // 응답을 검증하거나 필요한 테스트를 진행합니다.
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('documents');
            expect(response.body).to.have.property('meta');
            const addressNames = response.body.documents.map(document => document.road_address.address_name);
            cy.get(':nth-child(12) > .input-group > [type="text"]').invoke('val', addressNames.join(', '));
            cy.log(':nth-child(12) > .input-group > [type="text"]');
            const zipcode = response.body.documents.map(document => document.road_address.zone_no);
            cy.get('[name="zipcode"]').invoke('val', zipcode.join(', '));
        });
        cy.get('#vueAgencyModal > .modal-dialog > .modal-content > .modal-footer > .btn-primary').click();
    });

    //   cy.get('#global_modal_body').contains('입력한 내용으로 등록하시겠습니까?');
    //   cy.get('#global_modal_confirm').click();
});

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
//     emailModule.Email({
//         TestFails: TestFails,
//         EmailTitle: `[${Cypress.env('EmailTitle')}]`,
//         TestRange: TestRange,
//         Screenshots: Screenshots,
//     });
// });
// });
