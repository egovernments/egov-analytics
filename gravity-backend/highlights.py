from collections import namedtuple
import random
from datetime import datetime, timedelta
from common import DataLevels


class HighlightType(object):
    GENERAL = "general"
    ALERTS = "alerts"
    FORECASTS = "forecasts"


Highlight = namedtuple("Highlights", ["name", "value", "description"], verbose=False)


# Compute highlights from raw data
class HighlightTransformer(object):
    def __init__(self, type):
        self.type = type

    def compute(self, data, **kwargs):
        raise NotImplementedError()


class NumberOfComplaintTypesBeingModeled(HighlightTransformer):
    def __init__(self):
        super(NumberOfComplaintTypesBeingModeled, self).__init__(HighlightType.GENERAL)

    def compute(self, data, **kwargs):
        return Highlight("Modeled Complaint Types (Forecasts)", len(data["forecasts"]),
                         "The number of complaints being modeled for forecasting")


class AlertsCounter(HighlightTransformer):
    def __init__(self, name, description):
        super(AlertsCounter, self).__init__(HighlightType.ALERTS)
        self.name = name
        self.description = description

    def count(self, anoms, condition):
        count = 0
        for a in anoms:
            if condition(a):
                count += 1
        return count

    def _get_condition(self):
        raise NotImplementedError()

    def compute(self, data, **kwargs):
        func_ = self._get_condition()
        count = self.count(data["alerts"][DataLevels.CITY]["anomalies"], func_)
        for w in data["alerts"][DataLevels.WARD].keys():
            count += self.count(data["alerts"][DataLevels.WARD][w]["anomalies"], func_)
        for c in data["alerts"][DataLevels.COMPLAINT_TYPE].keys():
            count += self.count(data["alerts"][DataLevels.COMPLAINT_TYPE][c]["anomalies"], func_)
        return Highlight(self.name, count, self.description)


class AlertsInTheLastHour(AlertsCounter):
    def __init__(self):
        super(AlertsInTheLastHour, self).__init__("# Alerts(Last Hour)",
                                                  "The number of alerts generated in the last hour")

    def _get_condition(self):
        now = datetime.now()
        hour_ago = now + timedelta(hours=-1)
        return lambda _: hour_ago <= _ <= now


class AlertsInTheLastWeek(AlertsCounter):
    def __init__(self):
        super(AlertsInTheLastWeek, self).__init__("# Alerts(Last Week)",
                                                  "The number of alerts generated in the last week")

    def _get_condition(self):
        now = datetime.now()
        last_week = now + timedelta(days=-7)
        return lambda _: last_week <= _ <= now


class AlertsInTheLastMonth(AlertsCounter):
    def __init__(self):
        super(AlertsInTheLastMonth, self).__init__("# Alerts(Last Month)",
                                                   "The number of alerts generated in the last month")

    def _get_condition(self):
        now = datetime.now()
        month_ago = now + timedelta(days=-30)
        return lambda _: month_ago <= _ <= now


class AlertsInTheLastYear(AlertsCounter):
    def __init__(self):
        super(AlertsInTheLastYear, self).__init__("# Alerts(Last Year)",
                                                  "The number of alerts generated in the last year")

    def _get_condition(self):
        now = datetime.now()
        year_ago = now + timedelta(days=-365)
        return lambda _: year_ago <= _ <= now


class ComplaintsCounter(HighlightTransformer):
    def __init__(self, name, description):
        super(ComplaintsCounter, self).__init__(HighlightType.GENERAL)
        self.name = name
        self.description = description

    def count(self, data, condition):
        count = 0
        for d in data:
            if condition(d):
                count += 1
        return count

    def _get_condition(self):
        raise NotImplementedError()

    def compute(self, data, **kwargs):
        func_ = self._get_condition()
        count = self.count(data["alerts"][DataLevels.CITY]["data"], func_)
        for w in data["alerts"][DataLevels.WARD].keys():
            count += self.count(data["alerts"][DataLevels.WARD][w]["data"], func_)
        for c in data["alerts"][DataLevels.COMPLAINT_TYPE].keys():
            count += self.count(data["alerts"][DataLevels.COMPLAINT_TYPE][c]["data"], func_)
        return Highlight(self.name, count, self.description)


class ComplaintsInTheLastHour(ComplaintsCounter):
    def __init__(self):
        super(ComplaintsInTheLastHour, self).__init__("# Complaints(Last Hour)",
                                                      "The number of complaints generated in the last hour")

    def _get_condition(self):
        now = datetime.now()
        hour_ago = now + timedelta(hours=-1)
        return lambda _: hour_ago <= _["Time"] <= now


class ComplaintsInTheLastWeek(ComplaintsCounter):
    def __init__(self):
        super(ComplaintsInTheLastWeek, self).__init__("# Complaints(Last Week)",
                                                      "The number of complaints generated in the last week")

    def _get_condition(self):
        now = datetime.now()
        last_week = now + timedelta(days=-7)
        return lambda _: last_week <= _["Time"] <= now


class ComplaintsInTheLastMonth(ComplaintsCounter):
    def __init__(self):
        super(ComplaintsInTheLastMonth, self).__init__("# Complaints(Last Month)",
                                                       "The number of complaints generated in the last month")

    def _get_condition(self):
        now = datetime.now()
        month_ago = now + timedelta(days=-30)
        return lambda _: month_ago <= _["Time"] <= now


class ComplaintsInTheLastYear(ComplaintsCounter):
    def __init__(self):
        super(ComplaintsInTheLastYear, self).__init__("# Complaints(Last Year)",
                                                      "The number of complaints generated in the last year")

    def _get_condition(self):
        now = datetime.now()
        year_ago = now + timedelta(days=-365)
        return lambda _: year_ago <= _["Time"] <= now


highlights_list = [
    NumberOfComplaintTypesBeingModeled(),
    AlertsInTheLastHour(),
    AlertsInTheLastWeek(),
    AlertsInTheLastMonth(),
    AlertsInTheLastYear(),
    ComplaintsInTheLastHour(),
    ComplaintsInTheLastWeek(),
    ComplaintsInTheLastMonth(),
    ComplaintsInTheLastYear()
]
