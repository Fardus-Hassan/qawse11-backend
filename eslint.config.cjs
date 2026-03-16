module.exports = [
  {
    ignores: ["node_modules/**", "dist/**", ".env"],
  },
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];
