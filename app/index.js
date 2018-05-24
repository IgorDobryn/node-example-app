const fs = require('fs');
const { getApiStream } = require('./ApiStream');
const { json2csvStream } = require('./JsonToCsvStream');

const exportApiDataToCsv = (apiStreamOpts, outFileName) => {
  const fileStream = fs.createWriteStream(outFileName);
  getApiStream(apiStreamOpts)
    .on('end', () => fileStream.end())
    .pipe(json2csvStream)
    .pipe(fileStream);
}

module.exports = {
  exportApiDataToCsv,
}
