import tushare as ts
import pandas as pd


def get_top_list(date):
    '''
    return long hu bang
    :param date: Format is 'YYYY-MM-DD'
    :return: long hu bang
    '''
    df = ts.top_list(date)
    df[['pchange', 'amount', 'buy', 'bratio', 'sell', 'sratio']] = df[['pchange', 'amount', 'buy', 'bratio', 'sell', 'sratio']].apply(pd.to_numeric, errors='ignore')
    return df


def get_header_map():
    mapper = {}
    mapper['code'] = {'title': '股票代码', 'type': 'string'}
    mapper['name'] = {'title': '公司名称', 'type': 'string'}
    mapper['pchange'] = {'title': '涨跌幅', 'type': 'number'}
    mapper['amount'] = {'title': '龙虎榜成交额(万)', 'type': 'number'}
    mapper['buy'] = {'title': '买入额(万)', 'type': 'number'}
    mapper['bratio'] = {'title': '买入占总成交比例', 'type': 'number'}
    mapper['sell'] = {'title': '卖出额(万)', 'type': 'number'}
    mapper['sratio'] = {'title': '卖出占总成交比例', 'type': 'number'}
    mapper['reason'] = {'title': '上榜原因', 'type': 'string'}
    mapper['date'] = {'title': '日期', 'type': 'string'}
    return mapper

if __name__ == '__main__':
    df = get_top_list('2018-06-22')
    df[['pchange', 'amount', 'buy', 'bratio', 'sell', 'sratio']] = df[['pchange', 'amount', 'buy', 'bratio', 'sell', 'sratio']].apply(pd.to_numeric, errors='ignore')
    print(df.columns.values.tolist())
    result = df.to_json(orient='records', force_ascii=False)
    print(result)

