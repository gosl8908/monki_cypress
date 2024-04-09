module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'some-other-config-you-use', 'prettier'],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    plugins: ['@typescript-eslint', 'cypress'],
    rules: {
        // 큰 따옴표 사용 확인
        quotes: ['error', 'double'],
        // 세미콜론 사용 확인
        semi: [
            'error',
            'always',
            {
                omitLastInOneLineBlock: true,
            },
        ],
        // 미사용 변수 확인,
        'no-unused-vars': 'warn',
        // 미사용 함수 확인
        'no-unused-expressions': 'warn',
        // 2행 이상 공백 제한
        'no-multiple-empty-lines': [
            'error',
            {
                max: 1,
            },
        ],
        // 화살표 함수 파라미터 랩핑 확인,
        'arrow-parens': 'warn',
        // 빈 함수 확인
        'no-empty-function': 'error',
        // null 비교 등호 확인
        'no-eq-null': 'error',
        // 엄격한 등호 확인
        eqeqeq: 'error',
        // eval 사용 제한
        'no-eval': 'error',
        // 내장 함수의 첫 번째 인자에 문자열 삽입 제한
        'no-implied-eval': 'error',
        // scope 내 변수 중복 선언 제한
        'no-shadow': 'error',
        // udefined 식별자 사용 제한
        'no-undefined': 'warn',
        // 파라미터에 값 재할당 제한
        'no-param-reassign': 'error',
        // 불필요한 리터럴 연결 제한
        'no-useless-concat': 'warn',
        // 호이스팅 방지
        'no-use-before-define': 'error',
        // const 변수 재할당 제한
        'no-const-assign': 'error',
        // class 생성시 불필요 constructor 생성 제한
        'no-useless-constructor': 'warn',
        // import or export시 같은 이름으로 rename 제한
        'no-useless-rename': 'warn',
        // eslint-plugin-prettier 충돌
        'prettier/prettier': 'error',
    },
};