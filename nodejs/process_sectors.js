const { read_csv_to_json } = require('./utils/data_util');
const fs = require('fs');

async function save_sw_sectors() {
  const path = '../data/stock_by_sector_sw.csv';
  const json = await read_csv_to_json(path);

  const sectors = json.map(stock => stock.c_name).filter((item, index, arr) => arr.indexOf(item) === index);
  fs.writeFileSync('../data/sectors_sw.json', JSON.stringify({
    sectors
  }));
}

async function save_sina_sectors() {
  const path = '../data/stock_by_sector_sina.csv';
  const json = await read_csv_to_json(path);

  const sectors = json.map(stock => stock.c_name).filter((item, index, arr) => arr.indexOf(item) === index);
  fs.writeFileSync('../data/sectors_sina.json', JSON.stringify({
    sectors
  }));
}

save_sw_sectors();
save_sina_sectors();