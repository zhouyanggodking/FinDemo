from flask import Flask
from flask import jsonify

app = Flask(__name__)
app.config.from_json('config.json')

@app.route('/')
def hello_world():
    return 'godking'


@app.route('/api/top-list')
def top_list():
    res = {}
    res['data']='king'
    return jsonify(res)

if __name__ == '__main__':
    app.run()