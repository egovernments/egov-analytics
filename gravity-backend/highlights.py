from collections import namedtuple


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


highlights_list = [
    NumberOfComplaintTypesBeingModeled()
]
