const Json2csvTransform = require('json2csv').Transform;

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

module.exports = {
  json2csvStream: new Json2csvTransform(jsonToCsvOpts, jsonToCsvTransformOpts),
}
