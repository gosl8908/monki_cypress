const loginModule = require('./login.module.js');
const menuModule = require('./menu.module.js');
const apiModule = require('./api.module.js');
const emailModule = require('./email.module.js');
// 다른 모듈들도 필요한 경우 추가

module.exports = {
    menuModule,
    apiModule,
    loginModule,
    emailModule,
    // 다른 모듈들도 필요한 경우 추가
};
