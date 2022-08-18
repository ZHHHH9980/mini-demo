// scripts/rollup-plugin-import-css.js
import path from 'path';

export default () => ({
  renderChunk(code, chunk, options) {
    const { modules } = chunk;
    const modulesArr = Object.keys(modules);
    const isExsistCssSource = modulesArr.find(m => {
      const extName = path.extname(m);
      return ['.scss', '.sass', '.css', '.less'].indexOf(extName) !== -1;
    });
    if (isExsistCssSource) {
      return `import './index.css'\n${code}`;
    }
    return code;
  },
});
