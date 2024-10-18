const { loginModule, emailModule, apiModule } = require('../../module/manager.module.js');

describe('먼키 지점 생성', () => {
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

    it('지점 등록 Test', () => {
        cy.get('[data-mnu="/operation/*"] > [href="#"]').click();
        cy.get('.sidebar').contains('지점 관리').click();
        cy.get('#btnAddKitchen').click();
        cy.wait(3 * 1000);
        cy.get('#kitchen_id').type('mk_test1'); //지점 코드
        cy.get('#btnCheckKitchenId').click();
        cy.get('#kitchen_nm').type('번개지점');
        cy.get('#kitchen_phone').type(Cypress.env('Phone'));

        // 모듈화된 API 호출
        apiModule.api('경기 안양시 동안구 평촌대로 60-55').then(({ address_name, road_address_name, x, y }) => {
            // 주소 데이터를 각 입력 필드에 삽입
            cy.get('#address').invoke('val', address_name);
            cy.get('#road-address').invoke('val', road_address_name);
            cy.get('#longitude').invoke('val', x);
            cy.get('#latitude').invoke('val', y);
            cy.get('#address_detail').type('1');
        });

        // const apiKey = '419ed37eb9960d76f12d9ff0610d327a';
        // const query = encodeURIComponent('경기 안양시 동안구 평촌대로 60-55');

        // const url = `http://dapi.kakao.com/v2/local/search/address.json?query=${query}&page=1&size=10`;

        // cy.request({
        //     method: 'GET',
        //     url: url,
        //     headers: {
        //         Accept: '*/*',
        //         'Accept-Encoding': 'gzip, deflate',
        //         'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7,zh-CN;q=0.6,zh;q=0.5',
        //         Authorization: `KakaoAK ${apiKey}`,
        //         Host: 'dapi.kakao.com',
        //         ka: 'sdk/4.4.15 os/javascript lang/ko-KR device/Win32 origin/http%3A%2F%2Fstaging-mngr.monthlykitchen.kr',
        //         Origin: 'http://staging-mngr.monthlykitchen.kr',
        //         Referer: 'http://staging-mngr.monthlykitchen.kr/',
        //         'User-Agent':
        //             'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        //     },
        // }).then(response => {
        //     // 응답을 검증하거나 필요한 테스트를 진행합니다.
        //     expect(response.status).to.eq(200);
        //     expect(response.body).to.have.property('documents');
        //     expect(response.body).to.have.property('meta');

        //     /* 주소 입력 */
        //     const address = response.body.documents.map(document => document.address.address_name);
        //     const addressNames = response.body.documents.map(document => document.address_name);
        //     const x = response.body.documents.map(document => document.address.x);
        //     const y = response.body.documents.map(document => document.address.y);
        //     cy.get('#address').invoke('val', address.join(', '));
        //     cy.get('#road_address').invoke('val', addressNames.join(', '));
        //     cy.get('#longitude').invoke('val', x.join(', '));
        //     cy.get('#latitude').invoke('val', y.join(', '));
        // });

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
    afterEach('Status Check', function () {
        emailModule.screenshot2(FailureObj, Screenshots, this.currentTest);
    });
    after('Send Email', function () {
        const { title: describeTitle, tests: allTests } = this.test.parent; // describe의 제목과 모든 테스트를 한 번에 가져오기

        emailModule.email({
            TestFails,
            describeTitle,
            EmailTitle: `[${Cypress.env('EmailTitle')} - ${describeTitle}]`,
            TestRange: '먼키지점 지점 생성' + `\n${allTests.map(test => `${test.title}`).join('\n')}`,
            Screenshots,
        });
    });
});
