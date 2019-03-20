const express = require('express');
const fs = require('fs');
const { read_csv_to_json } = require('./utils/data_util');

const app = express();

const stockList = JSON.parse(fs.readFileSync('../data/stocks_sector_sw.json')).stocks;
const stockPrice = JSON.parse(fs.readFileSync('../data/stock_price.json'));

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

app.get('/api/stock_price', (req, res) => {
  const items = stockPrice.filter(item => item.trade > 1 && !/ST/.test(item.name) && !/300/.test(item.code));
  let order_by = 1;
  if (req.query.order_by === 'desc') {
    order_by = -1;
  }
  const result = items.sort((a, b) => {
    if (a.trade > b.trade) {
      return order_by;
    } 
    return -order_by;
  });
  return res.json(result);
});

app.listen(5000, () => console.log('listening on port 5000'));