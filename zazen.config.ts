const eslintConfig = `
	extends: [
		'@zazen',
		'@zazen/eslint-config/node',
		'@zazen/eslint-config/typescript',
	],
	rules: {
		'@typescript-eslint/no-require-imports': 'off',
		'import/no-anonymous-default-export': ['error', { allowObject: true }],
	},
`

export default {
	setEslintConfig: () => eslintConfig,
}
