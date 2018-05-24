const fs = require('fs');
const request = require('request');
const Json2csvTransform = require('json2csv').Transform;
const { Readable } = require('stream');

const jsonToCsvOpts = {
  fields: [
    'id', 'first_name', 'last_name', 'email', 'gender', 'ip_address',
    {
      label: 'address',
      value: ({ address }) => address ? `${address.street} ${address.City} ${address.State} ${address.Country}` : '',
    },
  ],
};
const jsonToCsvTransformOpts = { encoding: 'utf-8' };

const apiUrl = 'http://interviewapi20170221095727.azurewebsites.net/api/users';
const outFileName = './users.csv';

const user = process.argv[2];
const password = process.argv[3];

if (!user || !password) {
  throw 'user and password are not given'
}

const getApiStream = (url) => {
  let pageNumber = 1;
  const recordsPerPage = 1000;

  const isSuccessResponse = response => response.statusCode === 200
  const isLastPage = body => JSON.parse(body).length < recordsPerPage;

  return new Readable({
    objectMode: true,
    read() {
      request(url, {
        qs: {
          page_number: pageNumber
        },
        auth: {
          user: user,
          pass: password,
        },
      }, (error, response) => {
        pageNumber += 1;

        if (isSuccessResponse(response)) {
          this.push(response.body);

          if (isLastPage(response.body)) {
            this.push(null);
          }
        } else {
          this.push(null);
        }
      });
    },
  });
};

const json2csvStream = new Json2csvTransform(jsonToCsvOpts, jsonToCsvTransformOpts);
const fileStream = fs.createWriteStream(outFileName);
const apiStream = getApiStream(apiUrl);

apiStream
  .on('end', () => fileStream.end())
  .pipe(json2csvStream)
  .pipe(fileStream);
