import data_access.stock_list as stock_list
import model.markov as markov
import json


list = stock_list.get()
result_list = []
filepath = 'prob_up_5_up.json'
for code in list:
    try:
        result = markov.calc_probablity(code)
        item = {}
        item['prob'] = result[0]
        item['total'] = result[1]
        item['up_count'] = result[2]
        item['code'] = code
        print(item)
        result_list.append(item)
    except:
        pass

with open(filepath, 'w') as f:
    json.dump(result_list, f)