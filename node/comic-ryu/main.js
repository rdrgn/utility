const colors = require('colors/safe');
const fs = require('fs');
const path = require('path');
const request = require('request');
const shell = require('shelljs');

const directory = path.resolve('.', 'comic_ryu');
const titles = ['youryukai'];
const maxChapter = 50;
const maxPage = 50;

const beginAt = new Date().getTime();
let pageCount = 0;

titles.forEach(title => {
  for (let c = 1; c <= maxChapter; c++) {
    for (let p = 1; p <= maxPage; p++) {
      const chapter = ('00' + c).slice(-2);
      const page = ('00' + p).slice(-2);

      const url = `http://www.comic-ryu.jp/_${title}/comic/comic/${chapter}/${page}.jpg`;
      const dir = path.resolve(directory, title, chapter);
      const file = `${page}.jpg`;

      if (isFileExist(path.join(dir, file))) {
        console.log(`${colors.yellow('skipped')} ${url}`);
        pageCount++;
        continue;
      }

      request(
        {
          url,
          encoding: null,
        },
        (error, response, body) => {
          if (!error && response.statusCode === 200) {
            shell.mkdir('-p', dir);
            fs.writeFileSync(path.join(dir, file), body, 'binary');
            pageCount++;

            console.log(`${colors.green('done')} ${url}`);
          }
        }
      );
    }
  }
});

process.on('exit', code => {
  const endAt = new Date().getTime();
  const timeString = `${((endAt - beginAt) / 1000).toFixed(2)}s`;

  if (code) {
    console.log(`${colors.green('failed')} ${timeString}`);
  } else {
    console.log(`${pageCount} pages`);
    console.log(`${colors.green('done')} ${timeString}`);
  }
});

function isFileExist(path) {
  try {
    fs.statSync(path);
    return true;
  } catch (_) {
    return false;
  }
}
