const colors = require('colors/safe');
const request = require('request-promise');

const urlTemplate = `http://www.comic-ryu.jp/_{title}/comic/comic/{chapter}/{page}.jpg`;

async function fetch(title, options) {
  const fetchFollowingChapters = async chapterIndex => {
    try {
      const chapter = await fetchChapter(title, chapterIndex, options);
      const chapters = await fetchFollowingChapters(chapterIndex + 1);
      chapters.unshift(chapter);
      return chapters;
    } catch (error) {
      if (error.statusCode === 404 && chapterIndex !== 1) {
        return [];
      } else {
        throw error;
      }
    }
  };

  return await fetchFollowingChapters(1);
}
exports.fetch = fetch;

async function fetchChapter(title, chapterIndex, options) {
  const fetchFollowingPages = async pageIndex => {
    try {
      const page = await fetchPage(title, chapterIndex, pageIndex, options);
      const pages = await fetchFollowingPages(pageIndex + 1);
      pages.unshift(page);
      return pages;
    } catch (error) {
      if (error.statusCode === 404 && pageIndex !== 1) {
        return [];
      } else {
        throw error;
      }
    }
  };

  return await fetchFollowingPages(1);
}
exports.fetchChapter = fetchChapter;

async function fetchPage(title, chapterIndex, pageIndex, { debug }) {
  const fixedChapterIndex = ('00' + chapterIndex).slice(-2);
  const fixedPageIndex = ('00' + pageIndex).slice(-2);
  const url = urlTemplate
    .replace('{title}', title)
    .replace('{chapter}', fixedChapterIndex)
    .replace('{page}', fixedPageIndex);

  if (debug) {
    console.log(`${colors.blue('GET')} ${url}`);
  }
  const body = await request({ url, encoding: null });

  return { chapter: chapterIndex, page: pageIndex, body, url };
}
exports.fetchPage = fetchPage;
