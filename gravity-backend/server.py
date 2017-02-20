from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api

from data_api import data_api

# instantiating Flask application
app = Flask(__name__)
CORS(app)
api = Api(app)


class AlertsResourceV1(Resource):
    def get(self, level, sub_level=None):
        try:
            return data_api.get_alerts(level, sub_level)
        except (ValueError, KeyError) as e:
            return {
                       "error": e.message
                   }, 400


class ForecastsResourceV1(Resource):
    def get(self, level, sub_level=None):
        try:
            return data_api.get_forecasts(level, sub_level)
        except (ValueError, KeyError) as e:
            return {
                       "error": e.message
                   }, 400


class HighlightsResourceV1(Resource):
    def get(self):
        return data_api.get_highlights()


# setting endpoints
api.add_resource(AlertsResourceV1, "/v1/alerts/<string:level>/", "/v1/alerts/<string:level>/<string:sub_level>")
api.add_resource(ForecastsResourceV1, "/v1/forecasts/<string:level>/",
                 "/v1/forecasts/<string:level>/<string:sub_level>")
api.add_resource(HighlightsResourceV1, "/v1/highlights/")

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=5000)
