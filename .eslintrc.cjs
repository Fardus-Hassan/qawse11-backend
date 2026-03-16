module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    node: true,
    es2020: true,
  },
  rules: {
    // Project-specific overrides
    "no-console": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
};
