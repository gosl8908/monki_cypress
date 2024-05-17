function api() {
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
        // cy.get('#address').invoke('val', address.join(', '));
        const addressNames = response.body.documents.map(document => document.address_name);
        // cy.get('#road_address').invoke('val', addressNames.join(', '));
        const x = response.body.documents.map(document => document.address.x);
        // cy.get('#latitude').invoke('val', x.join(', '));
        const y = response.body.documents.map(document => document.address.y);
        // cy.get('#longitude').invoke('val', y.join(', '));
        const zipcode = response.body.documents.map(document => document.road_address.zone_no);
        // cy.get('[name="zipcode"]').invoke('val', zipcode.join(', '));
    });
}
module.exports = {
    api: api,
};
