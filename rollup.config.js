import typescript from '@rollup/plugin-typescript';

export default [
  // Main bundle (for backward compatibility and default export)
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'es',
        sourcemap: true,
        exports: 'auto',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
      }),
    ],
    external: [],
  },
  // Preserved modules for better tree-shaking (ESM only)
  // Note: generics.ts is excluded as it only contains type definitions
  // Note: date.ts is now a directory (date/) with multiple modules
  {
    input: [
      'src/index.ts',
      'src/address.ts',
      'src/array.ts',
      'src/currency.ts',
      'src/date/index.ts',
      'src/enum.ts',
      'src/hash.ts',
      'src/is.ts',
      'src/number.ts',
      'src/object.ts',
      'src/password.ts',
      'src/phone.ts',
      'src/random.ts',
      'src/regex.ts',
      'src/string.ts',
      'src/util.ts',
    ],
    output: [
      {
        dir: 'dist',
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: 'src',
        sourcemap: true,
        entryFileNames: '[name].esm.js',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
        declarationMap: true,
      }),
    ],
    external: [],
  },
];

