import terser from '@rollup/plugin-terser';

export default [
  {
    input: 'src/index.mjs',
    output: [
      { file: 'build/index.mjs', format: 'esm' },
      { file: 'build/index.js', format: 'cjs' },
    ],
    external: ['node:crypto', 'bcryptjs'],
    plugins: [terser({ format: { ascii_only: true } })],
  },
];
