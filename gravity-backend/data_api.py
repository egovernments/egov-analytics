import json
from datetime import datetime

from common import DataLevels
from highlights import highlights_list, HighlightType


class DataAPI(object):
    def __init__(self):
        self.data = json.load(open("data/data.json"))
        self.parsed_data = None
        self.date_format = "%Y-%m-%d %H:%M:%S"
        self._parse_data()
        self.data_levels = {DataLevels.CITY, DataLevels.COMPLAINT_TYPE, DataLevels.WARD}
        self.forecasts_complaint_types = set(self.data["forecasts"].keys())

    def parse_time_series(self, data, time_accessor=None):
        new_data = []
        for d in data:
            if isinstance(d, dict):
                _ = dict(d.items())
                _[time_accessor] = datetime.strptime(d[time_accessor], self.date_format)
                new_data.append(_)
            elif isinstance(d, str) or isinstance(d, unicode):
                new_data.append(datetime.strptime(d, self.date_format))
            else:
                raise NotImplementedError()
        return new_data

    def _parse_data(self):
        self.parsed_data = dict()
        # parse alerts data
        self.parsed_data["alerts"] = {
            DataLevels.WARD: {},
            DataLevels.COMPLAINT_TYPE: {},
            DataLevels.CITY: {
                "data": self.parse_time_series(self.data["alerts"][DataLevels.CITY]["data"], "Time"),
                "anomalies": self.parse_time_series(self.data["alerts"][DataLevels.CITY]["anomalies"], None)
            }
        }

        for ward, data in self.data["alerts"][DataLevels.WARD].iteritems():
            self.parsed_data["alerts"][DataLevels.WARD][ward] = {
                "data": self.parse_time_series(data["data"], "Time"),
                "anomalies": self.parse_time_series(data["anomalies"])
            }

        for complaint_type, data in self.data["alerts"][DataLevels.COMPLAINT_TYPE].iteritems():
            self.parsed_data["alerts"][DataLevels.COMPLAINT_TYPE][complaint_type] = {
                "data": self.parse_time_series(data["data"], "Time"),
                "anomalies": self.parse_time_series(data["anomalies"])
            }

        self.parsed_data["forecasts"] = {}

        for level in self.data["forecasts"]:
            self.parsed_data["forecasts"][level] = {
                "forecasts": self.data["forecasts"][level]["forecasts"][:],
                "data": self.data["forecasts"][level]["data"][:]
            }

    def get_highlights(self):
        highlights = {
            HighlightType.ALERTS: [],
            HighlightType.FORECASTS: [],
            HighlightType.GENERAL: []
        }

        for highlight in highlights_list:
            highlights[highlight.type].append(highlight.compute(self.parsed_data)._asdict())

        return highlights

    def _filter_alerts_data(self, data, start_date, end_date):
        filtered_data = {"data": [], "anomalies": []}
        for d in data["data"]:
            if start_date <= d["Time"] <= end_date:
                filtered_data["data"].append(d)

        for d in data["anomalies"]:
            if start_date <= d <= end_date:
                filtered_data["anomalies"].append(d)

        return filtered_data

    def get_alerts(self, level, start_date, end_date, sub_level=None):
        if level not in self.data_levels:
            raise ValueError("invalid level {}".format(level))

        if level == DataLevels.CITY:
            return self._filter_alerts_data(self.parsed_data["alerts"][DataLevels.CITY], start_date, end_date)

        if level == DataLevels.COMPLAINT_TYPE:
            return self._filter_alerts_data(self.parsed_data["alerts"][DataLevels.COMPLAINT_TYPE][sub_level],
                                            start_date,
                                            end_date)
        if level == DataLevels.WARD:
            return self._filter_alerts_data(self.parsed_data["alerts"][DataLevels.WARD][sub_level], start_date,
                                            end_date)

    def get_forecasts(self, level, sub_level=None):
        # the current data doesn't support levels other than a few complaint types, but that may change in the future
        # so I've added this support

        if level not in self.data_levels:
            raise ValueError("invalid level {}".format(level))

        if level != DataLevels.COMPLAINT_TYPE:
            raise ValueError("Invalid level or sub_level")

        if sub_level not in self.forecasts_complaint_types:
            raise ValueError("invalid complaint type {}".format(sub_level))

        return self.data["forecasts"][sub_level]

    def get_meta_data(self):
        return {
            "alerts": {
                "wards": self.data["alerts"][DataLevels.WARD].keys(),
                "complaint_types": self.data["alerts"][DataLevels.COMPLAINT_TYPE].keys()
            },
            "forecasts": {
                "complaint_types": list(self.forecasts_complaint_types)
            }
        }

    def get_ward_counts(self, date):
        counts = {}
        for i in range(0, 24):
            counts[i] = {}

        for ward, data in self.parsed_data["alerts"][DataLevels.WARD].iteritems():
            data = filter(lambda _: _["Time"].date() == date.date(), data["data"])
            data.sort(key=lambda _: _["Time"], reverse=True)

            for item in data:
                d = item["Time"]
                counts[d.hour][ward] = item["Data"] + counts[d.hour].get(ward, 0)

        return counts


data_api = DataAPI()

if __name__ == '__main__':
    print data_api.parsed_data["alerts"][DataLevels.CITY]
