function api(address) {
    const apiKey = '419ed37eb9960d76f12d9ff0610d327a';
    const query = encodeURIComponent(address);

    const url = `http://dapi.kakao.com/v2/local/search/address.json?query=${query}&page=1&size=10`;

    return cy
        .request({
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
        })
        .then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('documents');
            expect(response.body).to.have.property('meta');

            const document = response.body.documents[0]; // 첫 번째 결과만 사용
            return cy.wrap({
                address_name: document.address.address_name,
                road_address_name: document.road_address ? document.road_address.address_name : '',
                x: document.address.x,
                y: document.address.y,
                zipcode: document.road_address ? document.road_address.zone_no : '',
            });
        });
}

module.exports = {
    api,
};
