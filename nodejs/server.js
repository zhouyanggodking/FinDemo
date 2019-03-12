const express = require('express');
const fs = require('fs');
const { read_csv_to_json } = require('./utils/data_util');

const app = express();

const stockList = JSON.parse(fs.readFileSync('../data/stocks_sector_sw.json')).stocks;
console.log(stockList)

app.get('/api/sector_list', (req, res) => {
  const data = fs.readFileSync('../data/sectors_sw.json');
  res.end(data)
});

app.get('/api/stock_list', (req, res) => {
  // console.log(req)
  if (req.query.sector) {
    return res.json(stockList.filter(stock => stock.sector === req.query.sector));
  }
  return res.json(stockList)
});

app.listen(5000, () => console.log('listening on port 5000'));