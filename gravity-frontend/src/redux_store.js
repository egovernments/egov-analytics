import { createStore, combineReducers } from 'redux';
import axios from 'axios';

var instance = axios.create({
  baseURL: "http://localhost:5000"
});

function handleHttpError(error) {
  alert(error);
}

const highlightsReducer = function(state, action) {
  var new_state = null;
  if(state === undefined) {
    console.log("Initializing the state!")
    new_state = {
      "general" : [],
      "alerts" : [],
      "forecasts" : []
    };
  }

  console.log("highlightsReducer received action " + JSON.stringify(action));

  if(action.type === "UPDATE_HIGHLIGHTS") {
    instance.get("/v1/highlights/").then(function(response) {
      store.dispatch({
        type : "HIGHLIGHTS_STATE_UPDATED",
        data : response.data
      })
    }).catch(function (error) {
      handleHttpError(error);
      console.error(JSON.stringify(error));
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
          console.log("Value is indeed: " + value);
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
    var o = new Object();
    o[action.complaint_type] = action.data;
    new_state = Object.assign({}, state, o);
  }

  return new_state || state;
}

// Combine Reducers
const reducers = combineReducers({
  highlights: highlightsReducer,
  forecasts : forecastsReducer
});

const store = createStore(reducers);


export {store};
