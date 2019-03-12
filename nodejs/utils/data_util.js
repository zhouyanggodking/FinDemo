const csv = require('csvtojson');

const get_data_dir = () => '../data';

async function read_csv_to_json(path) {
  const json = await csv().fromFile(path);
  return json;
}

module.exports = {
  get_data_dir,
  read_csv_to_json
};
