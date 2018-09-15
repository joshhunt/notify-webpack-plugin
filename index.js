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
    compiler.hooks.done.tap('NotifyPlugin', (stat) => {
      stat.compilation.children = this.hideChildren ? [] : stat.compilation.children;
    });

    compiler.hooks.compile.tap('NotifyPlugin', () => {
      const action = this.firstRun ? 'starting to build' : 'updating';
      console.log('==> ' + chalk.cyan(`Webpack is ${action} ${this.name}...`));
    });

    compiler.hooks.done.tap('NotifyPlugin', this.onDone.bind(this));
  }

  onDone(rawWebpackStats) {
    const { time } = rawWebpackStats.toJson({ timings: true })
    const action = this.firstRun ? 'building' : 'updating';
    console.log('==> ' + chalk.green(`Webpack finished ${action} ${this.name} in ${time}ms`));

    this.firstRun = false;
  }
}
