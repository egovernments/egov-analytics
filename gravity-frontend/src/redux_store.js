import { createStore, combineReducers } from 'redux';
import axios from 'axios';
import ward_geo_json from "./Chennai.geojson";

var instance = axios.create({
  baseURL: "http://localhost:5000"
});

function handleHttpError(error) {
  alert(error);
}

const highlightsReducer = function(state, action) {
  var new_state = null;
  if(state === undefined) {
    new_state = {
      "general" : [],
      "alerts" : [],
      "forecasts" : []
    };
  }

  if(action.type === "UPDATE_HIGHLIGHTS") {
    instance.get("/v1/highlights/").then(function(response) {
      store.dispatch({
        type : "HIGHLIGHTS_STATE_UPDATED",
        data : response.data
      })
    }).catch(function (error) {
      handleHttpError(error);
    });
  } else if (action.type === "HIGHLIGHTS_STATE_UPDATED") {
    new_state = Object.assign({}, state, action.data);
  }

  return new_state || state;
}


const forecastsReducer = function(state = {}, action) {
  var new_state = null;

  if(action.type === "UPDATE_FORECASTS") {
    instance.get("/v1/metadata").then(function(response) {
      response.data.forecasts.complaint_types.forEach(function(value) {
        instance.get("/v1/forecasts/complaint_type/" + encodeURIComponent(value)).then(function(response) {
          store.dispatch({
            type : "FORECASTS_STATE_UPDATED",
            complaint_type: value,
            data: response.data
          });
        }).catch(function(error) {
          handleHttpError(error);
        });
      })
    }).catch(function(error) {
      handleHttpError(error);
    })
  } else if (action.type === "FORECASTS_STATE_UPDATED") {
    var o = {};
    o[action.complaint_type] = action.data;
    new_state = Object.assign({}, state, o);
  }

  return new_state || state;
}

const alertsReducer = function(state, action) {
  var new_state = null;

  if(state === undefined) {
    new_state = {
      wards : [],
      complaint_types : [],
      selected_ward : null, // no ward selected by default
      selected_complaint_type: null, // no complaint selected by default
      seleted_date: new Date(), // today's date by default
      ward_geo_json: {} // geojson for rendering wards
    };

    // populate initial variables from the API
    instance.get("/v1/metadata").then(function(response) {
      store.dispatch({
        type : "ALERTS_INIT_STATE",
        wards : response.data.alerts.wards,
        complaint_types: response.data.alerts.complaint_types
      });
    }).catch(function(error) {
      handleHttpError(error);
    });

    axios.get(ward_geo_json).then(function(response) {
      store.dispatch({
        type: "ALERTS_GEO_INIT_STATE",
        ward_geo_json: response.data
      });
    }).catch(function(error) {
      handleHttpError(error);
    });
  }

  if(action.type === "ALERTS_INIT_STATE") {
    new_state = Object.assign({}, state, {wards: action.wards, complaint_types: action.complaint_types});
  }

  if(action.type === "ALERTS_GEO_INIT_STATE") {
    new_state = Object.assign({}, state, {ward_geo_json: action.ward_geo_json});
  }

  return new_state || state;
}

// Combine Reducers
const reducers = combineReducers({
  highlights: highlightsReducer,
  forecasts : forecastsReducer,
  alerts: alertsReducer
});

const store = createStore(reducers);


export {store};
