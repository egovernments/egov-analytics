import json

from highlights import highlights_list, HighlightType


class DataLevels(object):
    CITY = "city"
    COMPLAINT_TYPE = "complaint_type"
    WARD = "ward"


class DataAPI(object):
    def __init__(self):
        self.data = json.load(open("data/data.json"))
        self.date_format = "%Y-%m-%d %H:%M:%S"
        self._parse_data()
        self.data_levels = {DataLevels.CITY, DataLevels.COMPLAINT_TYPE, DataLevels.WARD}
        self.forecasts_complaint_types = set(self.data["forecasts"].keys())

    def _parse_data(self):
        pass

    def get_highlights(self):
        highlights = {
            HighlightType.ALERTS: [],
            HighlightType.FORECASTS: [],
            HighlightType.GENERAL: []
        }

        for highlight in highlights_list:
            highlights[highlight.type] = highlight.compute(self.data)._asdict()

        return highlights

    def get_alerts(self, level, sub_level=None):
        if level not in self.data_levels:
            raise ValueError("invalid level {}".format(level))

        if level == DataLevels.CITY:
            return self.data["alerts"][DataLevels.CITY]

        if level == DataLevels.COMPLAINT_TYPE:
            return self.data["alerts"][DataLevels.COMPLAINT_TYPE][sub_level]

        if level == DataLevels.WARD:
            return self.data["alerts"][DataLevels.WARD][sub_level]

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


data_api = DataAPI()
