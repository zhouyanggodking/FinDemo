import tushare as ts
import numpy as np
import pandas as pd
from datetime import datetime

data_dir = '../data'

# start_date format 'YYYY-MM-DD'
def save(code, name, start_date):
    stock_data = ts.get_k_data(code, start=start_date)
    stock_data.to_csv(data_dir + '/stock/' + code + '.csv', columns=['date', 'open', 'close', 'high', 'low', 'volume', 'code'], index=0)
    return stock_data


def load(code):
    dtype = {
        'code': np.string_
    }
    # error handling??
    df = pd.read_csv(data_dir + '/stock/' + code + '.csv', dtype=dtype)
    return df

if __name__ == '__main__':
    dtype = {
        'code': np.string_
    }
    df = pd.read_csv(data_dir + '/stock_list.csv', dtype=dtype)
    # stock = [(row['code'], row['name'], str(row['timeToMarket'])) for (index, row) in df.iterrows()]

    for _, row in df.iterrows():
        timeToMarket_str = str(row['timeToMarket'])
        timeToMarket = timeToMarket_str[:4] + '-' + timeToMarket_str[4: 6] + '-' + timeToMarket_str[6:]
        name = row['name'].replace('*', '')
        print(name)
        save(row['code'], name, timeToMarket)
        print('finished downloading {}_{} data'.format(row['code'], row['name']))


