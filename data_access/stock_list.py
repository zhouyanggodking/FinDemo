import tushare as ts
import numpy as np
import pandas as pd

data_dir = '../data'

# save all stock ticker to csv file
def save():
    stock_list = ts.get_stock_basics()
    # remove invalid timeToMarket value
    stock_list = stock_list[stock_list['timeToMarket'] != 0]
    stock_list.to_csv(data_dir + '/stock_list.csv', encoding='utf-8')
    return stock_list


def get():
    dtype = {
        'code': np.string_,
        'name': np.string_
    }
    df = pd.read_csv(data_dir + '/stock_list.csv', dtype=dtype)
    return df


