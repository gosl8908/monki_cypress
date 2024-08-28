const { loginModule, emailModule } = require('../../module/manager.module.js');

describe('지점 등록 Test', () => {
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
            Site: `${Cypress.env('Admin')}`,
            Id: `${Cypress.env('AdminId')}`,
            Password: `${Cypress.env('AdminPwd')}`,
        });
    });

    it('지점 등록 Test', () => {
        cy.get('[data-mnu="/operation/*"] > [href="#"]').click();
        cy.get('.sidebar').contains('지점 관리').click();
        cy.get('#btnAddKitchen').click();
        cy.wait(3 * 1000);
        cy.get('#kitchen_id').type('mk_test1'); //지점 코드
        cy.get('#btnCheckKitchenId').click();
        cy.get('#kitchen_nm').type('번개지점');
        cy.get('#kitchen_phone').type(Cypress.env('Phone'));

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

            /* 주소 입력 */
            const address = response.body.documents.map(document => document.address.address_name);
            const addressNames = response.body.documents.map(document => document.address_name);
            const x = response.body.documents.map(document => document.address.x);
            const y = response.body.documents.map(document => document.address.y);
            cy.get('#address').invoke('val', address.join(', '));
            cy.get('#road_address').invoke('val', addressNames.join(', '));
            cy.get('#longitude').invoke('val', x.join(', '));
            cy.get('#latitude').invoke('val', y.join(', '));
        });
        cy.get('#address_detail').type('1');

        cy.fixture('image/로고이미지/번개상단.png', 'base64').then(fileContent => {
            cy.get('input[type="FILE"]').eq(1).attachFile({
                fileContent,
                filePath: 'image/로고이미지/번개상단.png',
                fileName: '번개상단.png',
                mimeType: 'image/png',
            });
        });

        cy.fixture('image/로고이미지/번개썸네일.jpg', 'base64').then(fileContent => {
            cy.get('input[type="FILE"]').eq(2).attachFile({
                fileContent,
                filePath: 'image/로고이미지/번개썸네일.jpg',
                fileName: '번개썸네일.jpg',
                mimeType: 'image/jpeg',
            });
        });

        cy.get('.btn-group > .btn').click();
        cy.wait(1 * 1000);
        cy.get('#global_modal_confirm').click();
        cy.wait(5 * 1000);

        cy.get('.card-default > .col-12 > .card').contains('대표 메뉴');
    });
    afterEach('Status Check', () => {
        emailModule.screenshot(Failure, Screenshots);
    });
    after('Send Email', () => {
        emailModule.email({
            TestFails,
            EmailTitle: `[${Cypress.env('EmailTitle')}]`,
            TestRange: '먼키지점 지점 생성',
            Screenshots,
        });
    });
});
