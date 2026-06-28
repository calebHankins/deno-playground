module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:jsdoc/recommended',
    ],
    env: {
        es2024: true,
        browser: true,
        node: true,
        mocha: true,
    },
    parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
    },
    plugins: [
        'json',
        'jsdoc',
    ],
    rules: {
        'indent': ['error', 4],
        'no-param-reassign': ['warn', { props: true }],
        'max-len': ['error', {
            code: 120,
            tabWidth: 4,
            ignoreUrls: true,
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],
        'no-use-before-define': ['error', {
            functions: false,
            classes: true,
            variables: true,
        }],
        'no-console': 'off',
    },
    overrides: [
        {
            files: ['*.json', '*.jsonc'],
            extends: ['plugin:json/recommended-legacy'],
        },
    ],
};
