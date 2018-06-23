from flask import Flask
from flask import jsonify
from data_access import measure
import json

app = Flask(__name__)
app.config.from_json('config.json')

@app.route('/')
def hello_world():
    return 'godking'


@app.route('/api/top-list')
def latest_top_list():
    df = measure.get_top_list('2018-06-22')
    headerMap = measure.get_header_map()
    headers = [{'key': header, 'title': headerMap[header]['title'], 'type': headerMap[header]['type']} for header in df.columns.values]
    body = df.to_json(orient='records', force_ascii=False)
    res = {}
    res['header'] = headers
    res['body'] = json.loads(body)
    return jsonify(res)

if __name__ == '__main__':
    app.run()