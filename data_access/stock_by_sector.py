import tushare as ts

data_dir = '../data'

category = 'sina'  # sw  or  sina

stocks = ts.get_industry_classified(category)
stocks.to_csv(data_dir + '/stock_by_sector_' + category + '.csv', encoding='utf-8')
