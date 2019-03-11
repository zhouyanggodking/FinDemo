const csv = require('csvtojson');

const getDataDir = () => '../data';

async function read_csv_to_json(path) {
  const json = await csv().fromFile(path);
  return json;
}

module.exports = {
  getDataDir,
  read_csv_to_json
};
