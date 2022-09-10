from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from scripts import util

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/classify_image', methods=['GET', 'POST'])
@cross_origin()
def classify_player():
    load_model()
    if request.method == 'POST':
        image_data = request.form['image_data']
        response = jsonify(util.classify_image(image_data))
        print(response)

        return response


def load_model():
    print('Starting Python Flask Server!')
    util.load_saved_artifacts()


if __name__ == '__main__':
    load_model()
    app.run(debug=True)
