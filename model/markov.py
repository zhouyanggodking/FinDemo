import pandas as pd
import numpy as np
import data_access.stock as stock


# 连续跌(涨)了n 天， n+1天涨（跌）的概率


# 以当天为起点， 查看在这以前n的涨跌情况， 如果会是跌，则满足要求，加入队列中
# 最后返回数组
def markov_down(code, consective_result, n_days):
    df = stock.load(code)
    df['change'] = df['close'] - df['close'].shift(1)
    df['ratio'] = df['change'] / df['close'].shift(1)
    result = []
    for index, row in df.iterrows():
        # skip first n days
        if index < n_days:
            continue
        mapper = {}
        start_index = index - n_days
        end_index = index - 1  # to the day before
        n_consecutive_data = df.loc[start_index: end_index, ['ratio', 'date']]
        if consective_result == 'up':
            up = (n_consecutive_data > 0).all()
            trend_satisfied = up['ratio']
        else:
            down = (n_consecutive_data < 0).all()
            trend_satisfied = down['ratio']

        if trend_satisfied:
            # print(df.loc[index-1]['date'])
            mapper['start'] = df.loc[start_index]['date']
            mapper['n_change'] = df.loc[start_index]['close'] - df.loc[end_index]['close']
            mapper['n_ratio'] = mapper['n_change'] / df.loc[start_index]['close']
            # print(df.loc[index - n_days]['date'])
            # print(n_consecutive_data)
            mapper['curr_ratio'] = df.loc[index]['ratio']
            mapper['curr_date'] = df.loc[index]['date']
            # print(mapper)
            # break
            result.append(mapper)
    return result


def calc_probablity(code, consective_result='up', n_days = 5, final_result='up'):
    result = markov_down(code, consective_result, 5)
    total_count = len(result)
    up_count = 0
    for item in result:
        if item['curr_ratio'] > 0:
            up_count += 1
    if final_result == 'up':
        probability = up_count / total_count
    else:
        probability = 1 - up_count / total_count
    return probability, total_count, up_count


if __name__ == '__main__':
    # code = '000001'
    code = '601003'
    result = calc_probablity(code, 'down', 5, 'up')
    json_r = {}
    # json_r['']
    print('total: {0}, up: {1} {2}%'.format(result[1], result[2], result[0] * 100))
