const request = require('request');
const { Readable } = require('stream');

const recordsPerPage = 1000;

const isSuccessResponse = response => response.statusCode === 200
const isLastPage = body => JSON.parse(body).length < recordsPerPage;
const getApiStream = ({ url, user, password }) => {
  let pageNumber = 1;

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

module.exports = {
  isSuccessResponse,
  isLastPage,
  getApiStream,
}
