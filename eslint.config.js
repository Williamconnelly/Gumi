// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
module.exports = tseslint.config(
	{
		files: ['**/*.ts'],
		extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic, ...angular.configs.tsRecommended],
		processor: angular.processInlineTemplates,
		rules: {
			curly: ['error', 'multi-or-nest'],
			// Angular selectors
			'@angular-eslint/directive-selector': [
				'error',
				{
					type: 'attribute',
					prefix: 'gumi',
					style: 'camelCase',
				},
			],
			'@angular-eslint/component-selector': [
				'error',
				{
					type: 'element',
					prefix: 'gumi',
					style: 'kebab-case',
				},
			],

			'@typescript-eslint/explicit-member-accessibility': [
				'error',
				{
					accessibility: 'explicit',
					overrides: {
						constructors: 'no-public',
					},
				},
			],
			'@typescript-eslint/no-namespace': 'off', // TODO: Remove after refactor
			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/consistent-generic-constructors': 'off',

			'padding-line-between-statements': [
				'error',
				{ blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
				{ blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
				{ blankLine: 'always', prev: '*', next: 'return' },
				{ blankLine: 'always', prev: '*', next: 'if' },
				{ blankLine: 'always', prev: 'if', next: '*' },
			],

			'@typescript-eslint/typedef': [
				'error',
				{
					variableDeclaration: true,
					memberVariableDeclaration: true,
					propertyDeclaration: true,
				},
			],

			'no-template-curly-in-string': 'error',
		},
	},
	{
		files: ['**/*.html'],
		extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
		rules: {},
	},
);
