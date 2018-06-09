const argv = require('argv');
const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');
const cr = require('../index.js');
const packageJson = require('../package.json');

argv.version(`v${packageJson.version}`);
argv.info(`Usage: ${packageJson.name} [--chapter=<chapter>] <title> [<directory>]`);
argv.option([
  {
    name: 'chapter',
    short: 'c',
    type: 'int',
    description: 'Specify a chapter to download',
  },
]);
const args = argv.run();

if (args.targets.length === 0) {
  argv.help();
  process.exit(0);
}

const title = args.targets[0];
const root = path.resolve(args.targets.length >= 2 ? args.targets[1] : '.', title);
mkdir(root);

console.log(`[1/2] Fetching images...`);

(args.options.chapter
  ? cr.fetchChapter(title, args.options.chapter, { debug: true })
  : cr.fetch(title, { debug: true })
).then(pages => {
  console.log(`[2/2] Writing images...`);

  pages.forEach(page => {
    const fixedChapterIndex = ('00' + page.chapter).slice(-2);
    const fixedPageIndex = ('00' + page.page).slice(-2);

    const directory = path.join(root, fixedChapterIndex);
    const filename = path.join(directory, `${fixedPageIndex}.${page.url.split('.').pop()}`);

    mkdir(directory);

    try {
      fs.writeFileSync(filename, page.body, 'binary');
      console.log(`${colors.green('done')} ${filename}`);
    } catch (error) {
      console.log(`${colors.red('failed')} ${filename}`);
      console.log(error);
    }
  });
});

function mkdir(path) {
  try {
    fs.mkdirSync(path);
  } catch (_) {}
}
