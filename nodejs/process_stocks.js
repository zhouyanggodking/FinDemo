const { read_csv_to_json } = require('./utils/data_util');
const fs = require('fs');

async function queryByName(name) {
  const path = '../data/stock_list.csv';
  const json = await read_csv_to_json(path);
  const zhong_stock = json.filter(stock => stock.name.indexOf(name) === 0).map(stock => {
    return {
      code: stock.code,
      name: stock.name
    }
  });
  console.log(zhong_stock)
}

// queryByName('中')



queryBySector('证券')

