import { withCustomConfig } from '@sap/eslint-config';

export default withCustomConfig([
    {
        ignores: ['**/dist', '**/dist-demo', '**/build', '**/.docusaurus', '**/node_modules', '**/vendor'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/prefer-readonly': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/array-type': 'off',
        },
    },
]);
