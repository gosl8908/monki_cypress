/* cypress.config.js */
const nodemailer = require('nodemailer');
const { defineConfig } = require('cypress');
/* 리포트 추가 */
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

/* Email Account */
const EamilId = 'gosl8908@gmail.com';
const EamilPwd = 'boft yzek iitd uuxa';

module.exports = defineConfig({
    viewportWidth: 1920,
    viewportHeight: 1080,
    pageLoadTimeout: 60000,
    experimentalStudio: true,
    projectId: 'k9i7ip',
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
        charts: true,
        reportPageTitle: 'custom-title',
        embeddedScreenshots: true,
        inlineAssets: true,
        saveAllAttempts: false,
    },
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
            require('cypress-mochawesome-reporter/plugin')(on);

            on('task', {
                sendEmail({ recipient, subject, body, screenshotFileNames }) {
                    const attachments = [];

                    /* 스크린샷 있는 경우 첨부 */
                    if (screenshotFileNames && screenshotFileNames.length > 0) {
                        screenshotFileNames.forEach(screenshotFileName => {
                            const path = `./cypress/screenshots/${screenshotFileName}`;
                            attachments.push({
                                filename: screenshotFileName,
                                encoding: 'base64',
                                path: path,
                            });
                        });
                    }
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: EamilId,
                            pass: EamilPwd,
                        },
                    });
                    const mailOptions = {
                        from: EamilId,
                        to: 'gosl8908@gmail.com',
                        subject: subject,
                        text: body,
                        attachments: attachments,
                    };
                    return transporter
                        .sendMail(mailOptions)
                        .then(info => {
                            console.log('이메일 성공적으로 전송됨: ' + info.response);
                            return true;
                        })
                        .catch(error => {
                            console.error('이메일 전송 실패: ' + error);
                            return false;
                        });
                },
            });
        },

        env: {
            /* STG Site */
            StgAdmin: 'http://staging-mngr.monthlykitchen.kr/users/login', //STG 통합
            StgCeo: 'http://staging-ceo.monthlykitchen.kr/users/login', //STG 사장님
            /* DEV Site */
            DevAdmon: 'http://test-a.mkitchen.kr:3010/users/login', //DEV 통합
            DevCeo: 'http://develop-ceo.monthlykitchen.kr/users/login', //DEV 사장님
            /* Id */
            AdminId: 'hskang', // 통합관리자
            TestId: 'monkitest', // 사장님사이트 - 총판대리점
            TestId1: 'monkitest1', // 사장님사이트 - 단골맛집
            TestId2: 'monkitest2', // 통합관리자 - 지점관리자
            TestId3: 'monkitest3', // 통합관리자 - 프렌차이즈관리자 / 사장님사이트 - 단골맛집(프랜차이즈)
            TestId4: 'monkitest4',
            TestId5: 'monki1', // 사장님사이트 - 사장님(지점)
            /* Password */
            AdminPwd: 'gotjd0215!',
            TestPwd: 'test123!',
            /* STG Smatro PG */
            SmatroMid: 'mk0000015m',
            SmatroKey: 'HVsPLswUE8L8pns5YrSNmDRNBSgcyUE/N1mGX2xeH0Hv3uCPMxdqZwn1XNnZUCgUXt1vx8WDSgjl0logstDE1g==',
            SmatroEasyMid: 'mk0000014m',
            SmatroEasyId: 'mk0000008p',
            SmatroEasyKey: 'NhaSDa1HF8SW6Y/guzfLEJ6IDGx2OpfDo04joedmFTAbpWhaCldKXT4IN2/hZ5QFlUix/IXZ9yis3H/003USPg==',

            /* content */
            EmailBody: `Cypress 자동화 테스트 스위트가 성공적으로 완료되었습니다`,
        },
    },
});
