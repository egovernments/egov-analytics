# Gravity

Gravity is the working title of the interface for the Forecasts and Alerts system.

The front-end is a React application, while the backend is in python, using flask-restful.

## Requirements
* python 2.7, pip
* node v7.5.0 (npm v4.1.2)
* (Optional, Recommended) Node Version Manager (`nvm`)
* (Optional, Recommended) `virtualenv`
* (Optional, Recommended) `twistd`

## Installation

Backend:
```
# Install virtualenv
sudo -H pip install virtualenv
cd gravity-backend
# Setup virtualenv
virtualenv .
source bin/activate
# install requirements
pip install -r requirements.txt
```

Front-end:
```
nvm use 7
cd gravity-frontend
npm install

# Optional, Recommended
sudo -H pip install twisted
```

## How to run
* Collect the `output.json` from the R library, and move it to `gravity-backend/data/data.json` (exact name)
* start the 2 servers:
  * navigate to `gravity-backend` and execute `python server.py`
  * navigate to `gravity-frontend` and execute `npm start`


## Production deployment

The above setup is only for development

For production,

* Back-end:

```
sh run.sh
```

* Front-end

```
npm run build
cd build
# OR use any suitable HTTP server
twistd -no web --path=.
```
