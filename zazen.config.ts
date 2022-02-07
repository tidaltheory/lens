type EsLintConfig = Record<string, unknown>

export default {
	setEslintConfig: (config: EsLintConfig) => ({
		...config,
		extends: [
			...((config.extends as string[]) ?? []),
			'@zazen/eslint-config/node',
			'@zazen/eslint-config/typescript',
		],
		rules: {
			...((config.rules as Record<string, unknown>) ?? []),
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'import/no-anonymous-default-export': [
				'error',
				{ allowObject: true },
			],
		},
	}),
}
