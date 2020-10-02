const puppeteer = require("puppeteer");

const { postUrl } = require("../constants/url");
const {
  showCommentSelector,
  moreCommentSelector,
  sortCommentSelector,
  recentCommentSortSelector,
  listCommentSelector,
  commentSelector,
  commentWithSeeMoreSelector,
  seeMoreButtonSelector,
} = require("../constants/DomElementSelector");

const crawl = async () => {
  const comments = [];

  // Open broswer, new page, set link
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });

  // Go to url
  await page.goto(postUrl);

  // Show comment
  await page.$eval(showCommentSelector, (elem) => elem.click());

  // Wait
  await page.waitForSelector(sortCommentSelector, {
    timeout: 5000,
  });

  // Click sort
  await page.evaluate(
    (sortCommentSelector) =>
      document.querySelector(sortCommentSelector).click(),
    sortCommentSelector
  );

  // Wait
  await page.waitForSelector(recentCommentSortSelector, {
    timeout: 5000,
  });

  // Select sort
  // Binh luan gan nhat
  await page.evaluate(
    (recentCommentSortSelector) =>
      document.querySelectorAll(recentCommentSortSelector)[1].click(),
    recentCommentSortSelector
  );

  // Show all comment
  while (true) {
    try {
      await page.waitForSelector(moreCommentSelector, {
        timeout: 5000,
      });

      await page.evaluate(
        (moreCommentSelector) =>
          document.querySelector(moreCommentSelector).click(),
        moreCommentSelector
      );
    } catch (e) {
      break;
    }
  }

  // get all comment
  let listComment = await page.$$(listCommentSelector);

  // get comment text
  for (comment of listComment) {
    try {
      let hasSeeMore = await comment.$(commentWithSeeMoreSelector);

      if (hasSeeMore) {
        await comment.$eval(seeMoreButtonSelector, (btn) => btn.click());

        const text = await comment.$eval(
          commentWithSeeMoreSelector,
          (a) => a.innerText
        );
        comments.push(text);
      } else {
        const text = await comment.$eval(commentSelector, (a) => a.innerText);
        comments.push(text);
      }
    } catch (e) {
      // Khong phai la text
    }
  }

  console.log("Done");
  await browser.close();
  return comments;
};

module.exports = crawl;
