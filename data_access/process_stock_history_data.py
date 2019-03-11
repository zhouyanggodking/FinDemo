import tushare as ts
import stock_list

# ts.get_h_data(code, auType=auType)  # default one year data

stocks = stock_list.get()
codeList = stocks['code']

for code in codeList:
    try:
        print('processing ' + code)
        historyData = ts.get_hist_data(code)  # default one year data
        historyData.to_csv('../data/stock_history/' + code + '.csv', encoding='utf-8')
    except:
        pass
