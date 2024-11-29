/* cypress.config.js */
const nodemailer = require('nodemailer');
const { defineConfig } = require('cypress');
const glob = require('glob');
const fs = require('fs');
require('dotenv').config();
/* 리포트 추가 */
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

const gmailEmailId = process.env.GMAIL_EMAIL_ID;
const gmailEmailPwd = process.env.GMAIL_EMAIL_PWD;
const doorayEmailId = process.env.DOORAY_EMAIL_ID;
const doorayEmailId2 = process.env.DOORAY_EMAIL_ID2;
const doorayEmailPwd = process.env.DOORAY_EMAIL_PWD;
const Phone = process.env.PHONE;

module.exports = defineConfig({
    // viewportWidth: 1920,
    // viewportHeight: 1080,
    viewportWidth: process.env.GITHUB_ACTIONS ? 1000 : 1920,
    viewportHeight: process.env.GITHUB_ACTIONS ? 660 : 1080,
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
                    if (screenshotFileNames?.length) {
                        screenshotFileNames.forEach(screenshotFileName => {
                            const localPath = `./cypress/screenshots/${screenshotFileName}`;
                            const cloudPath = `/home/runner/work/monki_cypress/monki_cypress/cypress/screenshots/**/${screenshotFileName}`;
                            const filePath = fs.existsSync(localPath) ? localPath : glob.sync(cloudPath)[0] || null;

                            if (filePath) {
                                attachments.push({
                                    filename: screenshotFileName,
                                    encoding: 'base64',
                                    path: filePath,
                                });
                            }
                        });
                    }
                    // if (screenshotFileNames && screenshotFileNames.length > 0) {
                    //     screenshotFileNames.forEach(screenshotFileName => {
                    //         const path = `./cypress/screenshots/${screenshotFileName}`;
                    //         const cloudPath = `/home/runner/work/monki_cypress/monki_cypress/cypress/screenshots/**/${screenshotFileName}`;
                    //         const cloudMatches = glob.sync(cloudPath);
                    //         const filePath = fs.existsSync(path)
                    //             ? path
                    //             : cloudMatches.length > 0
                    //               ? cloudMatches[0]
                    //               : null;

                    //         attachments.push({
                    //             filename: screenshotFileName,
                    //             encoding: 'base64',
                    //             path: filePath,
                    //         });
                    //     });
                    // }
                    // 두레이 메일용 transporter
                    const dooraytransporter = nodemailer.createTransport({
                        host: 'smtp.dooray.com',
                        port: 465,
                        secure: true, // STARTTLS
                        auth: {
                            user: doorayEmailId,
                            pass: doorayEmailPwd,
                        },
                    });
                    const dooraymailOptions = {
                        from: doorayEmailId,
                        to: `${doorayEmailId}, ${doorayEmailId2}`,
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
                    //         user: gmailEmailId,
                    //         pass: gmailEmailPwd,
                    //     },
                    // });

                    // const gmailmailOptions = {
                    //     from: gmailEmailId,
                    //     to: gmailEmailId,
                    //     subject: subject,
                    //     text: body,
                    //     attachments: attachments,
                    // };
                    return gmailtransporter
                        .sendMail(gmailmailOptions)
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
            AdminEmail: doorayEmailId,
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

            /* Password */
            AdminPwd: gmailEmailPwd,
            TestPwd: 'test123!',
            TestPwd2: 'test1234',

            /* Number */
            Phone: Phone,
            TestPhone: '01012341234',
            /* content */
            EmailBody: `Cypress 자동화 테스트 스위트가 성공적으로 완료되었습니다`,
            menuPrices: `
            꽈배기,4000,꽈배기
            달걀듬뿍볶음밥,4500,달걀듬뿍볶음밥
            국물맵떡,9000,국물맵떡
            퐁듀치즈볼(3개),3500,퐁듀치즈볼 3개
            퐁듀치즈볼(6개),6000,퐁듀치즈볼 6개
            고르곤치즈볼(3개),3500,고르곤치즈볼 3개
            고르곤치즈볼(6개),6000,고르곤치즈볼 6개
            웨지감자,4000,웨지감자
            칩카사바,2000,칩카사바
            포테이토앤칩스,6500,포테이토앤칩스
            샐러드,5000,샐러드
            소이파채샐러드,4000,소이파채샐러드
            한입쏙직화닭발,17000,한입쏙직화닭발
            츠쿠네어묵탕,18000,크추네어묵탕
            허니순살[S],13000,[반마리] 살맛나는 꿀조합! 부드럽고 담백한 안심과 정육을 사용한 순살치킨과 달콤한 허니소스의 조화!
            교촌옥수수통안심,23000,리얼옥수수의 진한 풍미와 달콤함이 특징인 촉촉하고 부드러운 100% 통안심 순살메뉴
            교촌옥수수순살,23000,리얼옥수수의 진한 풍미와 달콤함이 특징인 바삭하고 부드러운 100% 정육 순살메뉴
            교촌옥수수오리지날,20000,리얼옥수수의 진한 풍미와 달콤함이 특징인 한마리 치킨
            시그니처점보윙,28000,교촌점보윙 레드점보윙 허니갈릭점보윙을 한 번에 즐길 수 있는 메뉴(24조각)
            반반점보윙(레드-허니),19000,청양홍고추의 매콤함이 일품인 레드점보윙과 허니에 갈릭을 더한 풍미 깊은 허니갈릭점보윙을 한번에 맛볼 수 있는 메뉴(16조각)
            반반점보윙(교촌-레드),19000,마늘간장소스의 교촌점보윙과 청양홍고추의 매콤함이 일품인 레드점보윙을 한번에 맛볼 수 있는 메뉴(16조각)
            반반점보윙(허니-교촌),19000,허니에 갈릭을 더한 풍미 깊은 허니갈릭점보윙과 마늘간장소스의 교촌점보윙을 한번에 맛볼 수 있는 메뉴(16조각)
            교촌점보윙,19000,마늘간장소스의 교촌윙을 점보사이즈로 즐길 수 있는 메뉴(16조각)
            레드점보윙,19000,청양홍고추의 매콤함이 일품인 레드윙을 점보사이즈로 즐길 수 있는 메뉴(16조각)
            허니점보윙,19000,허니에 갈릭을 더한 풍미 깊은 허니갈릭점보윙(16조각)
            리얼후라이드,20000,오트밀 퀴노아 아마란스 등 슈퍼푸드로 바삭함을 살린 후라이드
            허니오리지날,19000,달콤 바삭한 맛이 일품인 한 마리 치킨
            레드오리지날,20000,국내산 청양 홍고추의 매콤함이 일품인 한 마리 치킨
            교촌오리지날,19000,교촌만의 차별화된 마늘과 간장 소스의 풍부한 맛이 어우러진 한 마리 치킨
            반반오리지날,20000,마늘 간장 맛과 매콤한 맛이 어우러진 한 마리 치킨
            교촌콤보,22000,마늘과 간장소스의 풍부한 맛에 가장 인기있는 부위인 날개와 다리를 함께 즐길 수 있는 메뉴
            레드콤보,23000,국내산 청양 홍고추의 매콤한 맛에 날개와 다리를 함께 즐길 수 있는 메뉴
            허니콤보,23000,달콤한 허니소스에 쫄깃한 날개와 담백한 다리가 만난 메뉴
            반반콤보,23000,마늘 간장 맛과 매콤한 맛이 밴 날개와 다리의 행복한 만남
            살살후라이드,20000,가슴살과 다리살이 쌀가루와 만나 고소하고 바삭한 맛이 일품
            살살후라이드미니,7000,[미니] 가슴살이 쌀가루와 만나 고소하고 바삭한 맛이 일품 (소스 3종 중 택1)
            허니순살,23000,살맛나는 꿀조합! 부드럽고 담백한 안심과 정육을 사용한 순살치킨과 달콤한 허니소스의 조화!
            교촌순살,22000,부드럽고 바삭한 정육 순살에 감칠 맛나는 마늘 간장 소스가 어우러진 순살치킨
            레드순살,23000,부드럽고 바삭한 정육 순살에 청양 홍고추의 매콤함이 맛있게 어우러진 순살치킨
            반반순살,23000,부드럽고 바삭한 정육 순살에 감칠 맛나는 마늘 간장 소스와 청양 홍고추의 매콤함을 동시에 느낄 수 있는 순살치킨
            교촌스틱,22000,마늘과 간장 소스의 풍부한 맛과 다리부위의 담백한 맛이 어우러진 치킨
            교촌콤보[S],12000,[반마리] 마늘과 간장 소스의 풍부한 맛에 가장 인기있는 부위인 날개와 다리를 함께 즐길 수 있는 메뉴
            반반스틱,23000,마늘 간장 맛과 매콤함 맛에 담백한 다리의 맛이 어우러진 치킨
            반반윙,23000,마늘 간장 맛과 매콤한 맛이 밴 날개와 봉의 멋진 조화
            교촌윙,22000,마늘과 간장소스의 풍부한 맛이 묻어나는 날개와 봉의 멋진 조화 교촌윙
            교촌윙[S],12000,[반마리] 마늘과 간장 소스의 풍부한 맛이 묻어나는 윙과 봉의 멋진 조화
            레드윙,23000,국내산 청양 홍고추의 매콤함이 골고루 밴 쫄깃한 날개와 봉의 만남!
            레드스틱,23000,국내산 청양 홍고추의 매콤함에 담백한 다리의 맛이 어우러진 치킨
            교촌순살[S],12000,[반마리] 부드럽고 바삭한 정육 순살에 감칠 맛나는 마늘 간장 소스가 어우러진 순살 치킨
            파채소이살살,19000,새콤달콤한 소이소스와 담백한 살살치킨에 신선한 채소를 곁들인 촉촉하며 바삭한 맛
            교촌스틱[S],12000,[반마리] 마늘과 간장 소스의 풍부한 맛과 다리부위의 담백한 맛이 어우러진 치킨
            레드콤보[S],13000,[반마리] 국내산 청양 홍고추의 매콤한 맛에 날개와 다리를 함께 즐길 수 있는 메뉴
            레허반반순살,23000,레드로 매콤하게 허니로 달콤하게! 맵단맵단으로 즐길 수 있는 100% 국내산 정육 안심 순살 메뉴
            레드순살[S],13000,[반마리] 부드럽고 바삭한 정육 순살에 청양 홍고추의 매콤함이 맛있게 어우러진 순살치킨
            레드윙[S],13000,[반마리] 국내산 청양 홍고추의 매콤함이 골고루 밴 쫄깃한 윙과 봉의 만남
            레드스틱[S],13000,[반마리] 국내산 청양 홍고추의 매콤함에 담백한 다리의 맛이 어우러진 치킨
            코카콜라,2500,코카콜라
            코카콜라-제로,2500,코카콜라제로
            펩시,2500,펩시
            펩시-제로,2500,펩시제로
            스프라이트,2500,스프라이트
            스프라이트-제로,2500,스프라이트제로
            새로,500,새로
            진로,500,진로
            참이슬,500,참이슬
            카스,500,카스
            테라,500,테라
            `,
            optionPrices: `
                옥수수볼,5000
                달걀듬뿍볶음밥,4000
                의성마늘볶음밥,4000
                샐러드 추가,5000
                고르곤치즈볼,6000
                와일드블랙소스,1000
                허니케찹소스,1000
                치즈트러플시즈닝,2000
                무 추가,1000
                레드디핑소스,1000
            `,
            menuPrices2: `테스트,1000,테스트`,
            optionPrices2: `테스트,1000`,

            menuGroups: {
                NEW: ['교촌옥수수통안심', '교촌옥수수순살', '교촌옥수수오리지날'],
                믹스시리즈: [
                    '반반오리지날',
                    '반반콤보',
                    '반반순살',
                    '반반윙',
                    '반반스틱',
                    '레허반반순살',
                    '시그니처순살세트',
                ],
                후라이드시리즈: ['리얼후라이드', '살살후라이드미니', '살살후라이드', '파채소이살살'],
                점보윙시리즈: [
                    '허니점보윙',
                    '레드점보윙',
                    '교촌점보윙',
                    '반반점보윙(허니-교촌)',
                    '반반점보윙(교촌-레드)',
                    '반반점보윙(레드-허니)',
                    '시그니처점보윙',
                ],
                허니시리즈: ['허니순살', '허니콤보', '허니오리지날'],
                레드시리즈: ['레드스틱', '레드윙', '레드순살', '레드콤보', '레드오리지날'],
                교촌시리즈: ['교촌스틱', '교촌윙', '교촌순살', '교촌콤보', '교촌오리지날'],
                반반시리즈: [
                    '허니순살[S]',
                    '교촌콤보[S]',
                    '교촌윙[S]',
                    '교촌순살[S]',
                    '교촌스틱[S]',
                    '레드콤보[S]',
                    '레드순살[S]',
                    '레드윙[S]',
                    '레드스틱[S]',
                ],
                사이드메뉴: [
                    '츠쿠네어묵탕',
                    '한입쏙직화닭발',
                    '소이파채샐러드',
                    '샐러드',
                    '포테이토앤칩스',
                    '칩카사바',
                    '웨지감자',
                    '고르곤치즈볼(6개)',
                    '고르곤치즈볼(3개)',
                    '퐁듀치즈볼(6개)',
                    '퐁듀치즈볼(3개)',
                    '국물맵떡',
                    '달걀듬뿍볶음밥',
                    '꽈배기',
                ],
                음료: ['코카콜라', '코카콜라-제로', '펩시', '펩시-제로', '스프라이트', '스프라이트-제로'],
                주류: ['새로', '진로', '카스', '테라', '참이슬'],
            },
        },
    },
});
