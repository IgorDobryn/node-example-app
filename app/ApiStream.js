const request = require('request');
const { Readable } = require('stream');

const recordsPerPage = 1000;

const isSuccessResponse = response => response.statusCode === 200
const isLastPage = body => JSON.parse(body).length < recordsPerPage;
const getApiStream = ({ url, user, password }) => {
  let pageNumber = 1;
  let endReached = false;

  return new Readable({
    objectMode: true,
    read() {
      if (endReached) return;

      request.get(url, {
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
            endReached = true;
            this.push(null);
          }
        } else {
          endReached = true;
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
