import tushare as ts


def get_top_list(date):
    '''
    return long hu bang
    :param date: Format is 'YYYY-MM-DD'
    :return: long hu bang
    '''
    return ts.top_list(date)

