import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ 
      tsconfig: './tsconfig.json',
      exclude: ['**/*.test.*', '**/*.stories.*'],
      declaration: false, // Skip declaration generation in dev mode
    }),
  ],
  external: ['react', 'react-dom'],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
};
