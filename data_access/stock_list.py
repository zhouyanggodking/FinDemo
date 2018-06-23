import tushare as ts

data_dir = '../data'


def save():
    stock_list = ts.get_stock_basics()
    # remove invalid timeToMarket value
    stock_list = stock_list[stock_list['timeToMarket'] != 0]
    stock_list.to_csv(data_dir + '/stock_list.csv')
    return stock_list


if __name__ == '__main__':
    stock_list = save()
    print('saved all stock info successfully, total {0} stocks'.format(stock_list.shape[0]))
