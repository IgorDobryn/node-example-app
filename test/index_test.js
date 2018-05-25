const stringToStream = require('string-to-stream');
const fs = require('fs');
const nock = require('nock');
const { expect, use } = require("chai");
const { exportApiDataToCsv } = require('../app/index');

use(require('chai-fs'));

describe('exportApiDataToCsv', () => {
  const host = 'http://localhost:9292';
  const path = '/MyUrl.json';
  const url = host + path;
  const auth = {
    user: 'MyUser',
    password: 'MyPassword',
  };
  const outFile = './test.csv';

  const user = {
    id: 1002,
    first_name: 'John',
    last_name: 'Doe',
    email: 'jd@jd.com',
    gender: 'Male',
    ip_address: '10.10.10.10',
    address: {
      street: 'Street',
      City: 'City',
      State: 'Nevada',
      Country: 'United States'
    }
  }


  beforeEach(() => {
    if (fs.existsSync(outFile)) {
      fs.unlink(outFile);
    }

    nock(host)
      .get(path)
      .basicAuth({
        user: auth.user,
        pass: auth.password,
      })
      .query({
        page_number: 1,
      })
      .reply(200, () => {
        return stringToStream(JSON.stringify([user]));
      });

    nock(host)
      .get(path)
      .basicAuth({
        user: auth.user,
        pass: auth.password,
      })
      .query({
        page_number: 2,
      })
      .reply(404, () => {
        return stringToStream('No more records');
      });
  });

  it('fetches data from API and creates csv file', () => {
    expect(outFile).to.not.be.a.path();

    exportApiDataToCsv({ ...auth, url }, outFile, () => {
      const csv = fs.readFileSync(outFile, 'utf8');

      expect(csv.split("\n")).to.eql([
        '"id","first_name","last_name","email","gender","ip_address","address"',
        '1002,"John","Doe","jd@jd.com","Male","10.10.10.10","Street City Nevada United States"',
      ]);
      done();
    });
  });

  it('saves data from multiple requests');
  it('does nothing on unsuccess responses');
  it('handles invalid credentials');
  it('handles invalid page number param');
  it('handles response with incorrect JSON syntax');
  it('warns if given file name already exists');
});
