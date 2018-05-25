const fs = require('fs');
const { getApiStream } = require('./ApiStream');
const { json2csvStream } = require('./JsonToCsvStream');

const exportApiDataToCsv = (apiStreamOpts, outFileName, callback = () => {}) => {
  const fileStream = fs.createWriteStream(outFileName);
  getApiStream(apiStreamOpts)
    .on('finish', callback)
    .pipe(json2csvStream)
    .pipe(fileStream);
}

module.exports = {
  exportApiDataToCsv,
}
