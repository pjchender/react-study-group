module.exports = {
  extends: ['pjchender'],
  parserOptions: {
    project: 'tsconfig.eslint.json',
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'no-console': 'off',
  },
};
