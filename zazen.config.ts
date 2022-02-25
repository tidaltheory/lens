/* eslint-disable import/no-extraneous-dependencies */
import { Linter } from 'eslint'

export default {
	setEslintConfig: (config: Linter.Config) => ({
		...config,
		extends: [
			...(config.extends as string[]),
			'@zazen/eslint-config/node',
			'@zazen/eslint-config/typescript',
		],
		rules: {
			...config.rules,
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					modifiers: ['const'],
					format: ['camelCase', 'UPPER_CASE'],
				},
			],
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'import/no-anonymous-default-export': [
				'error',
				{ allowObject: true },
			],
		},
	}),
}
