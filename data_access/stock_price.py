import tushare as ts

data_dir = '../data'

df = ts.get_today_all()

df.to_json(data_dir + '/stock_price.json', orient='records')
