export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module'
        },
        rules: {
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
            'linebreak-style': ['error', 'windows'],
            'indent': ['error', 4],
            'prefer-const': ['warn', { 'destructuring': 'all' }],

        }
    }
];