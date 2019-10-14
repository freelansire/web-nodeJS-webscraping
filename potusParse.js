const rp = require('request-promise');
const $ = require('cheerio');
linkHasIOT = []
const potusParse = function (url, allUrls) {
  return rp(url)
    .then(function (html) {
      
      if(html.toLowerCase().indexOf('iot') !== -1) {
        linkHasIOT.push(url)
      }
      let limit = 45;
      const newURLs = []
      for (let i = 0; i < limit; i++) {
        if (
          $('a', html)[i]
          && !($('a', html)[i].attribs.href).includes('#')
          && !($('a', html)[i].attribs.href).includes('http://')
          && !($('a', html)[i].attribs.href).includes('https://')
          && $('a', html)[i].attribs.href !== 'javascript:void(0)'
          && allUrls.indexOf($('a', html)[i].attribs.href) === -1
          && newURLs.indexOf($('a', html)[i].attribs.href) === -1
        ) {

          limit += 1;
          newURLs.push($('a', html)[i].attribs.href);
        }
      }
      return Promise.all(
        newURLs.map(function (url) {
          return potusParse('https://www.chevron.com' + url, [...allUrls, ...newURLs]);
        })
      );
    })
    .then(function (presidents) {
      return {
        linkHasIOT,
        allUrls
      };
    })
    .catch(function (err) {
      //handle error
    });
};

module.exports = potusParse;