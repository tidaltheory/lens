module.exports = {
    extends: ['@zazen/eslint-config'],
    plugins: ['@typescript-eslint'],
    rules: {
        'prefer-const': 'off',
    },
    overrides: [
        {
            files: ['**.ts'],
            extends: [
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.json
                'plugin:@typescript-eslint/recommended',
                // https://github.com/prettier/eslint-config-prettier/blob/master/%40typescript-eslint.js
                'prettier/@typescript-eslint',
            ],
            parser: '@typescript-eslint/parser',
            env: {
                node: true,
            },
            rules: {
                'prefer-const': 'off',

                '@typescript-eslint/ban-types': 'warn',
                '@typescript-eslint/no-unused-vars': 'off',
            },
        },
    ],
}
