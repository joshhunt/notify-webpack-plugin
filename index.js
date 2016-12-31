/* eslint-disable */
const chalk = require('chalk');

module.exports = class NotifyPlugin {
  constructor(name, isProd) {
    this.name = name
    this.firstRun = true;
    this.hideChildren = !isProd;
  }

  apply(compiler) {
    // Hack to get rid of the 'Child extract-text...' log spam
    compiler.plugin('done', (stat) => {
      stat.compilation.children = this.hideChildren ? [] : stat.compilation.children;
    });

    compiler.plugin('compile', () => {
      const action = this.firstRun ? 'starting to build' : 'updating';
      console.log('==> ' + chalk.cyan(`Webpack is ${action} ${this.name}...`));
    });

    compiler.plugin('done', this.onDone.bind(this));
  }

  onDone(rawWebpackStats) {
    const { time } = rawWebpackStats.toJson({ timings: true })
    const action = this.firstRun ? 'building' : 'updating';
    console.log('==> ' + chalk.green(`Webpack finished ${action} ${this.name} in ${time}ms`));

    this.firstRun = false;
  }
}
