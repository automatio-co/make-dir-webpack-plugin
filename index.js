var fs = require('fs');
var path = require('path');

class MakeDirWebpackPlugin {
  constructor(options) {
    if (!options || !options.dirs)
      throw new Error('options and options.dirs must be specified');

    this.dirs = options.dirs;
  }

  makeDir(dir) {
    const sep = path.sep;
    const initDir = path.isAbsolute(dir) ? sep : '';
    dir.split(sep).reduce((parentDir, childDir) => {
      const currentDir = path.resolve(parentDir, childDir);
      if (!fs.existsSync(currentDir)) {
        fs.mkdirSync(currentDir);
      }
      return currentDir;
    }, initDir);
  }

  apply(compiler) {
    const doneHook = () => {
      this.dirs.forEach((dirSpec) => {
        this.makeDir(dirSpec.path);
      });
    };
    // https://github.com/gdborton/webpack-parallel-uglify-plugin/issues/58#issuecomment-499537639
    // avoid compiler hook warning
    if (compiler.hooks) {
      compiler.hooks.done.tap('MakeDirWebpackPlugin', doneHook);
    } else {
      compiler.plugin('done', doneHook);
    }
  }
}

module.exports = MakeDirWebpackPlugin;
