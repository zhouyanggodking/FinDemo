import tushare as ts

data_dir = 'data'
stock_list = ts.get_stock_basics()
stock_list.to_csv(data_dir + '/stock_list.csv')
