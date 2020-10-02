const crawl = require("./crawl/crawl");

(async () => {
  const comments = await crawl();
  console.log(comments);
})();
