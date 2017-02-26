import React, { Component } from 'react';
import { store } from "./redux_store.js";
import { connect } from 'react-redux';
import { HighlightsPanel } from "./highlight.js";

import MetricsGraphics from 'react-metrics-graphics';

class ForecastsPanel extends Component {
  render() {

    var data = this.props.data.data.map(function(d) {
      return {
        value : d.Data,
        date: new Date(d.Time),
        upper: null,
        lower: null
      }
    });

    this.props.data.forecasts.forEach(function(d) {
      data.push({
        value: d.Forecast,
        date: new Date(d.Time),
        upper: d.High_80,
        lower: d.Low_80,
        color: "#fff"
      })
    })

    return (
      <div className='forecasts-panel'>
        <h3>{this.props.complaint_type}</h3>
        <div className="forecasts-chart">
          <MetricsGraphics
            title="Downloads"
            description="This graphic shows a time-series of downloads."
            data={data}
            width={500}
            height={250}
            x_accessor="date"
            y_accessor="value"
            show_confidence_band = {["upper", "lower"]}
            color_accessor={"color"}
            area={false}
          />
        </div>
        <div className="forecasts-table">
          <div>table</div>
        </div>
      </div>
    );
  }
}

class ForecastsTab extends Component {
  render() {
    var panels = [];
    for (var key in this.props.forecasts) {
      if (!this.props.forecasts.hasOwnProperty(key)) {
        continue;
      }

      panels.push(
        <ForecastsPanel key={key} complaint_type={key} data={this.props.forecasts[key]} />
      );
    }

    return (
      <div>
        <HighlightsPanel label='forecasts' highlights={this.props.highlights.forecasts}></HighlightsPanel>
        {panels}
      </div>
    );
  }
}



const mapStateToProps = function(store) {
  return {
    highlights: store.highlights,
    forecasts : store.forecasts
  };
}


export default connect(mapStateToProps)(ForecastsTab);
