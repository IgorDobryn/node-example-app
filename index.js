const fs = require('fs');
const { getApiStream } = require('./ApiStream');
const { json2csvStream } = require('./JsonToCsvStream');

const apiUrl = 'http://interviewapi20170221095727.azurewebsites.net/api/users';

const user = process.argv[2];
const password = process.argv[3];
const outFileName = process.argv[4];

if (!user || !password || !outFileName) {
  throw 'user, password and output file must be specified'
}

const fileStream = fs.createWriteStream(outFileName);
getApiStream({ url: apiUrl, user, password })
  .on('end', () => fileStream.end())
  .pipe(json2csvStream)
  .pipe(fileStream);
