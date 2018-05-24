const { exportApiDataToCsv } = require('./app/index')

const apiUrl = 'http://interviewapi20170221095727.azurewebsites.net/api/users';

const user = process.argv[2];
const password = process.argv[3];
const outFileName = process.argv[4];

if (!user || !password || !outFileName) {
  throw 'user, password and output file must be specified'
}


exportApiDataToCsv({ url: apiUrl, user, password }, outFileName);
