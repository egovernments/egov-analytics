# How to run

* Place output from the R library into `data/data.json`
* Install requirements using (in a virtualenv):
 ```
pip install -r requirements.txt
```

* Run using:
```
python server.py
```



## Resources

### 1. [/v1/highlights/](http://localhost:5000/v1/highlights/)

Returns highlights.

Example response:
```
{
  "alerts": [
    ...
  ],
  "general": {
    "name": "Modeled Complaint Types (Forecasts)",
    "value": 2,
    "description": "The number of complaints being modeled for forecasting"
  },
  "forecasts": [
    ...
  ]
}
```

### 2. [/v1/alerts/](http://localhost:5000/v1/alerts/)

Return data associated with alerts.

Example Response:


```
{
  "data": [
    {
      "Data": 1,
      "Time": "2012-01-01 07:02:43"
    },
    {
      "Data": 1,
      "Time": "2012-01-01 13:44:49"
    },
    {
      "Data": 1,
      "Time": "2012-01-01 18:23:44"
    },
    {
      "Data": 3,
      "Time": "2012-01-01 19:06:11"
    },
    ...
  ],
  "anomalies": [
    "2012-01-01 19:06:11",
    "2012-01-01 18:23:44",
    ...
  ]
}

```

This is available at different levels
##### [City Level Alerts: /v1/alerts/city/](http://localhost:5000/v1/alerts/city/)
##### [Ward Level Alerts: /v1/alerts/ward/ward_number](http://localhost:5000/v1/alerts/ward/N188)
##### [Complaint Level Alerts: /v1/alerts/complaint_type/complaint_type_name](http://localhost:5000/v1/alerts/complaint_type/Mosquito%20menace%20)



### 3. [/v1/forecasts/](http://localhost:5000/v1/forecasts/)

Return data associated with forecasts

Example Response:


```
{
  "data": [
    {
      "Year": 2010,
      "Month": 1,
      "Data": 0,
      "Time": "2010-01-01"
    },
    {
      "Year": 2010,
      "Month": 2,
      "Data": 0,
      "Time": "2010-02-01"
    },
    {
      "Year": 2010,
      "Month": 3,
      "Data": 0,
      "Time": "2010-03-01"
    },
    ...
  ],
  "forecasts": [
    {
      "High_95": 1766.6664,
      "Low_80": 1023.7135,
      "High_80": 1611.1748,
      "Forecast": 1317.4441,
      "Year": 2016,
      "Low_95": 868.2218,
      "Month": "Aug"
    },
    {
      "High_95": 1816.6943,
      "Low_80": 944.9376,
      "High_80": 1634.2455,
      "Forecast": 1289.5916,
      "Year": 2016,
      "Low_95": 762.4888,
      "Month": "Sep"
    },
    ...
  ]
}
```

This is currently available only for complaint level:
##### [Complaint Level Forecasts: /v1/forecasts/complaint_type/complaint_type_name](http://localhost:5000/v1/forecasts/complaint_type/Non%20Burning%20of%20Street%20Lights)
