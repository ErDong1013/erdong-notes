const urlMapping = {
  '/note/typescript': ['/note/typescript', '/note/fe-development-cookbook'],
};

// * ================================================================================

const flatList = Object.entries(urlMapping)
  .map(([newUrl, oldUrls]) =>
    oldUrls.map((oldUrl) => [
      [oldUrl + '.html', newUrl + '.html'],
      [oldUrl, newUrl + '.html'],
    ]),
  )
  .flat(2);

module.exports = { flatList };
