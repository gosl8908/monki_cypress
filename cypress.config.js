/* cypress.config.js */
const nodemailer = require('nodemailer');
const { defineConfig } = require('cypress');
/* 리포트 추가 */
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

/* Email Account */
const gmailEamilId = 'gosl8908@gmail.com';
const gmailEamilPwd = 'boft yzek iitd uuxa';
/* Email Account */
const doorayEamilId = 'hskang@monki.net';
const doorayEamilPwd = 'gotjd0215!';

module.exports = defineConfig({
    viewportWidth: 1920,
    viewportHeight: 1080,
    pageLoadTimeout: 60 * 1000,
    redirectionLimit: 30,
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
                            // const path = `./cypress/screenshots/${screenshotFileName}`;

                            console.log(`Original screenshotFileName: ${screenshotFileName}`);
                            const cleanedFileName = screenshotFileName.split('/').pop();
                            const path = `./cypress/screenshots/${cleanedFileName}`;
                            console.log(`Cleaned FileName: ${cleanedFileName}`);
                            console.log(`Path: ${path}`);
                            attachments.push({
                                filename: screenshotFileName,
                                encoding: 'base64',
                                path: path,
                            });
                        });
                    }
                    // 두레이 메일용 transporter
                    const dooraytransporter = nodemailer.createTransport({
                        host: 'smtp.dooray.com',
                        port: 465,
                        secure: true, // STARTTLS
                        auth: {
                            user: doorayEamilId,
                            pass: doorayEamilPwd,
                        },
                    });
                    const dooraymailOptions = {
                        from: doorayEamilId,
                        to: doorayEamilId,
                        subject: subject,
                        text: body,
                        attachments: attachments,
                    };

                    return dooraytransporter
                        .sendMail(dooraymailOptions)
                        .then(info => {
                            console.log('이메일 성공적으로 전송됨: ' + info.response);
                            return true;
                        })
                        .catch(error => {
                            console.error('이메일 전송 실패: ' + error);
                            return false;
                        });
                    // const gmailtransporter = nodemailer.createTransport({
                    //     host: 'smtp.gmail.com',
                    //     port: 587,
                    //     secure: false,
                    //     auth: {
                    //         user: gmailEamilId,
                    //         pass: gmailEamilPwd,
                    //     },
                    // });

                    // const gmailmailOptions = {
                    //     from: gmailEamilId,
                    //     to: gmailEamilId,
                    //     subject: subject,
                    //     text: body,
                    //     attachments: attachments,
                    // };
                },
            });
        },

        env: {
            /* Prod Sit */
            Admin: 'https://crew.monki.net/users/login', //Prod 통합
            Ceo: 'https://ceo.monki.net/users/login', //Prod 사장님

            /* STG Site */
            StgAdmin: 'http://staging-mngr.monthlykitchen.kr/users/login', //STG 통합
            StgCeo: 'https://staging-ceo.monthlykitchen.kr/users/login', //STG 사장님

            /* DEV Site */
            DevAdmin: 'http://develop-mngr.monthlykitchen.kr/users/login', //DEV 통합
            DevCeo: 'http://develop-ceo.monthlykitchen.kr/users/login', //DEV 사장님

            /* email */
            AdminEmail: 'hskang@monki.net',
            TestEmail: 'monkitest@ruu.kr',

            /* Admon Id */
            AdminId: 'hskang', // 통합관리자

            /* 통합관리자 Id */
            TestId: Array.from({ length: 10 }, (_, i) => `monkitest${i + 1}`),

            /* 대리점 ID */
            StoreTestId: Array.from({ length: 5 }, (_, i) => `monkistore${i + 1}`),

            /* 단골맛집 ID */
            FavTestId: Array.from({ length: 5 }, (_, i) => `monkifav${i + 1}`),

            /* 사장님 ID */
            CeoTestId: Array.from({ length: 5 }, (_, i) => `monkiceo${i + 1}`),

            // /* 통합관리자 Id */
            // TestId: 'monkitest1',
            // TestId2: 'monkitest2',
            // TestId3: 'monkitest3',
            // TestId4: 'monkitest4',
            // TestId5: 'monkitest5',
            // TestId6: 'monkitest6',
            // TestId7: 'monkitest7',
            // TestId8: 'monkitest8',
            // TestId9: 'monkitest9',
            // TestId10: 'monkitest10',
            // /* 사장님사이트 Id */
            // /* 대리점 ID */
            // StoreTestId1: 'monkistore1', // 통합관리자에서 만든 총판대리점
            // StoreTestId2: 'monkistore2',
            // StoreTestId3: 'monkistore3',
            // StoreTestId4: 'monkistore4',
            // StoreTestId5: 'monkistore5',

            // /* 단골맛집 ID */
            // FavTestId1: 'monkifav1', // 총판대리점에서 만든 매장
            // FavTestId2: 'monkifav2', // 프렌차이즈에서 만든 매장
            // FavTestId3: 'monkifav3',
            // FavTestId4: 'monkifav4',
            // FavTestId5: 'monkifav5',

            // /* 사장님 ID */
            // CeoTestId1: 'monkiceo1', // 지점에서 만든 매장
            // CeoTestId2: 'monkiceo2',
            // CeoTestId3: 'monkiceo3',
            // CeoTestId4: 'monkiceo4',
            // CeoTestId5: 'monkiceo5',

            /* Password */
            AdminPwd: 'gotjd0215!',
            TestPwd: 'test123!',
            /* KIS OFF-PG */
            KISMid: 'monthly01m',
            KISMid2: 'monthly02m',
            KISKey: 'FhvzXeFPMaNt/AF6D9Xppqy+56NfjodzQpcVWHTC1cKr0C4QQLaZTsQNPBYD4fOPiH2Sea1N50yKFGhZ9U33qQ==',
            KISKey2: 'wvaPslUxzvfjo0s0nomtu1CWepfGr5ILJHV/QzbXVaxqcEf9DR6IOIJ7CuHVzn9dJm0hCMYjnnr1oSozP/ehAQ==',
            KISTid: 'ZZ000982',
            KISTid2: 'ZZ001412',
            /* Smatro PG */
            SmatroMid: 'mk0000001m',
            SmatroMid2: 'mk1000002m',
            SmatroKey: '6i2584C/myaAkpvrPUmh2CrsPuZC+DN6dOg0hfGcKJcO/q1mH87e5oFaJcy34+2cf1mxpcA4TO5SaCk888Autw==',
            SmatroKey2: 'wN4qQoJXOY4XIcsUbR3bKVFgqN7t697rF7Emp4mB6tZcBvg5AR7hVnOlOiJsw6YVtjjRAud+6TbZ5HWklOV4sA==',
            /* Smatro Easy PG */
            SmatroEasyid: 'mk0000008p',
            SmatroEasyMid: 'mk1000006m',
            SmatroEasyKey: 'eGCyrHNIOW5X1P73pZ9QmT9mjSjZ0qWV0Tmwkax8t4XBTIXV/Tq37AtN7wb6lVcjrz+edvkFHBv7GVUh0A9VJg==',
            /* STG KIS PG */
            StgKISMid: 'kistest00m',
            StgKISKey: '2d6ECGhR1pg/1QGE1lcRI4awsWEgshjEyI8UgYslLPJSuNeyPTkdrT8XWARezvDTUJClWQWhjxzBbu7AsuLZqg==',
            /* STG Smatro PG */
            StgSmatroMid: 'mk0000015m',
            StgSmatroMid2: 'mk0000017m',
            StgSmatroKey: 'HVsPLswUE8L8pns5YrSNmDRNBSgcyUE/N1mGX2xeH0Hv3uCPMxdqZwn1XNnZUCgUXt1vx8WDSgjl0logstDE1g==',
            StgSmatroKey2: 'gFM2c3Nzow8lOaBbyIszcirfLVToqPIYlkjz9LUOuTft1e146Yb0qCndHwCe4tv9VyZhy87UJZ/csQKRLxGKnQ==',
            /* stg Smatro Easy PG */
            StgSmatroEasyMid: 'mk0000014m',
            StgSmatroEasyMid2: 'mk0000016m',
            StgSmatroEasyId: 'mk0000008p',
            StgSmatroEasyKey:
                'NhaSDa1HF8SW6Y/guzfLEJ6IDGx2OpfDo04joedmFTAbpWhaCldKXT4IN2/hZ5QFlUix/IXZ9yis3H/003USPg==',
            StgSmatroEasyKey2:
                'Xn2AIuJYLyb0PqRBRypnbESDzHqaThVNO9xRziC62wSZyWd1S5SLNEczvdGuxY1JMcrLQ/soGHe7eBK1GP+T4A==',
            /* STG KOVAN PG */
            StgKOVANMid: 'M20230922117157',
            StgKOVANKey: 'a3e1672d2fe364e424cce94706007f9c',
            /* Number */
            Phone: '01020431653',
            TestPhone: '01012341234',
            /* content */
            EmailBody: `Cypress 자동화 테스트 스위트가 성공적으로 완료되었습니다`,
        },
    },
});
