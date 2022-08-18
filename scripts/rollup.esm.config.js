import { nodeResolve } from '@rollup/plugin-node-resolve';

import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import image from '@rollup/plugin-image';
import ts from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import autoExternal from 'rollup-plugin-auto-external';
import path from 'path';
import importCss from './rollup-plugin-import-css';

const resolve = (...dirs) => path.resolve(__dirname, '../', ...dirs);

function toUpperCase(match) {
  return match.replace('-', '').toUpperCase();
}

export default [
  {
    input: resolve('src/lib/index.tsx'),
    output: [
      {
        file: resolve('dist/index.esm.js'),
        format: 'es',
        sourcemap: true,
      },
    ],
    // 对react、react-dom不需要打包，semi-ui-react也不需要打，依赖项目本身的Semi版本
    external: id => {
      try {
        const idSourcePath = require.resolve(id, { paths: [resolve()] });
        return idSourcePath && idSourcePath.includes('node_modules');
      } catch (error) {
        return false;
      }
    },
    plugins: [
      ts({
        check: false,
        tsconfig: resolve('tsconfig.json'),
        tsconfigOverride: {
          compilerOptions: { declaration: true, declarationDir: resolve('dist/type') },
        },
        verbosity: 2,
        useTsconfigDeclarationDir: true,
        include: ['*.ts+(|x)', '**/*.ts+(|x)', '*.js+(|x)', '**/*.js+(|x)'],
      }),
      image(),
      postcss({
        extensions: ['.css', '.scss', '.less'],
        autoModules: true,
        extract: 'index.css',
        namedExports(name) {
          let reg = /-[a-z]/g;
          const temp = name.replace(reg, toUpperCase);
          return temp;
        },
      }),
      json(),
      alias({
        entries: [
          {
            find: 'src',
            replacement: resolve('src'),
          },
        ],
      }),
      nodeResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        // some package.json files have a "browser" field which specifies
        // alternative files to load for people bundling for the browser. If
        // that's you, either use this option or add "browser" to the
        // "mainfields" option, otherwise pkg.browser will be ignored
        browser: true,
        preferBuiltins: true,
        mainFields: ['browser', 'jsnext', 'module', 'main'],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.SEMI_ICON_LAZY_LOAD': true,
        preventAssignment: true,
      }),
      autoExternal({
        packagePath: resolve(),
      }),
      importCss(),
    ],
  },
  {
    // 这里要根据组件实际tyep文件路径写
    // 如果执行报错请检查dist产物的type文件位置
    input: resolve('dist/type/src/lib/index.d.ts'),
    external: id => {
      try {
        const idSourcePath = require.resolve(id, { paths: [resolve()] });
        return idSourcePath && idSourcePath.includes('node_modules');
      } catch (error) {
        return false;
      }
    },
    output: [{ file: resolve('dist/index.d.ts'), format: 'es' }],
    plugins: [dts()],
  },
];
