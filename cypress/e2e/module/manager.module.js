const loginModule = require('./login.module.js');
const createModule = require('./create.module.js');
const apiModule = require('./api.module.js');
const emailModule = require('./email.module.js');
const payModule = require('./pay.module.js');
const setModule = require('./set.module.js');
// 다른 모듈들도 필요한 경우 추가

module.exports = {
    apiModule,
    setModule,
    loginModule,
    emailModule,
    payModule,
    createModule,
    // 다른 모듈들도 필요한 경우 추가
};
