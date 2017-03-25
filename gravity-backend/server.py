import json
from datetime import datetime

from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api

from data_api import data_api
from flask_restful import reqparse


# DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


class MyJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)


# instantiating Flask application
class MyConfig(object):
    RESTFUL_JSON = {"cls": MyJSONEncoder}


# instantiating Flask application
app = Flask(__name__)
app.config.from_object(MyConfig)
CORS(app)
api = Api(app)


class AlertsResourceV1(Resource):
    def get(self, level, sub_level=None):
        parser = reqparse.RequestParser()
        parser.add_argument('start_date', required=True, help="state_date needs to be provided")
        parser.add_argument('end_date', required=True, help="end_date needs to be provided")

        args = parser.parse_args()

        start_date = datetime.strptime(args["start_date"], "%Y-%m-%d")
        end_date = datetime.strptime(args["end_date"], "%Y-%m-%d")
        try:
            return data_api.get_alerts(level, start_date, end_date, sub_level)
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


class MetaDataResourceV1(Resource):
    def get(self):
        return data_api.get_meta_data()


class WardCountsResourceV1(Resource):
    def get(self, date):
        date = datetime.strptime(date, "%Y-%m-%d")
        return data_api.get_ward_counts(date)


# setting endpoints
api.add_resource(AlertsResourceV1, "/v1/alerts/<string:level>", "/v1/alerts/<string:level>/<string:sub_level>")
api.add_resource(ForecastsResourceV1, "/v1/forecasts/<string:level>/",
                 "/v1/forecasts/<string:level>/<string:sub_level>")
api.add_resource(WardCountsResourceV1, "/v1/alerts/counts/ward/<string:date>")
api.add_resource(HighlightsResourceV1, "/v1/highlights/")
api.add_resource(MetaDataResourceV1, "/v1/metadata/")

if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=False, port=5000)
