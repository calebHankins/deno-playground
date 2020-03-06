module.exports = {
    extends: 'airbnb-base',
    env: {
        es6: true,
        browser: true,
        node: true,
        mocha: true,
    },
    rules: {

        // sync up with editor config
        'indent': ['error', 4],

        // we need jsdoc for a shared lib
        'require-jsdoc': 'warn',
        'valid-jsdoc': 'warn',

        // setting to warning for param reassignment.  In cases with req and
        // res for express apps.  It's good to alter the param
        'no-param-reassign': ['warn', { props: true }],

        // max-len set to 120 based on team poll
        'max-len': ['error', {
            code: 120,
            tabWidth: 4,
            ignoreUrls: true,
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
        }],

        // Allow using functions before they are defined
        'no-use-before-define': ['error', {
            'functions': false,
            'classes': true,
        }],

        // Since this is mainly a CLI experimentation repo, suppressing the no-console rule
        'no-console': 'off',
    },
    plugins: [
        'json'
    ],
};
