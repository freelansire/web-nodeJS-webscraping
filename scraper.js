const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./potusParse');
const url = 'https://www.chevron.com';

rp(url)
  .then(function (html) {
    //success!
    console.log('crawlng is started it may take time !!')
    const allUrls = [];
    let limit = 45;
    for (let i = 0; i < limit; i++) {

      if (
        $('a', html)[i]
        && !($('a', html)[i].attribs.href).includes('#')
        && !($('a', html)[i].attribs.href).includes('http://')
        && !($('a', html)[i].attribs.href).includes('https://')
        && $('a', html)[i].attribs.href !== 'javascript:void(0)'
        && allUrls.indexOf($('a', html)[i].attribs.href) === -1
      ) {
        limit += 1;
        allUrls.push($('a', html)[i].attribs.href);
      }
    }
    return Promise.all(
      allUrls.map(function (url) {
        return potusParse('https://www.chevron.com' + url, allUrls);
      })
    );
  })
  .then(function (presidents) {
    console.log('crawlng is done')
    console.log(presidents);
  })
  .catch(function (err) {
    //handle error
    console.log(err);
  });