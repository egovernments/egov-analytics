import React, { Component } from 'react';
import { store } from "./redux_store.js";
import { connect } from 'react-redux';
import { HighlightsPanel } from "./highlight.js";
import MetricsGraphics from 'react-metrics-graphics';
import ReactTable from 'react-table';


function offset(element){
    var body = document.body,
        win = document.defaultView,
        docElem = document.documentElement,
        box = document.createElement('div');
    box.style.paddingLeft = box.style.width = "1px";
    body.appendChild(box);
    var isBoxModel = box.offsetWidth == 2;
    body.removeChild(box);
    box = element.getBoundingClientRect();
    var clientTop  = docElem.clientTop  || body.clientTop  || 0,
        clientLeft = docElem.clientLeft || body.clientLeft || 0,
        scrollTop  = win.pageYOffset || isBoxModel && docElem.scrollTop  || body.scrollTop,
        scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;
    return {
        top : box.top  + scrollTop  - clientTop,
        left: box.left + scrollLeft - clientLeft
    };
}

class ForecastsPanel extends Component {

  mouseOver(d, i) {
    const selectPoint = document.getElementsByClassName("mg-active-datapoint")[0];
    var elems = document.getElementsByClassName("mg-line-rollover-circle");
    var selectedCircle = null;
    for(i in elems) {
      var elem = elems[i];
      if(elem.style && elem.style.opacity == 1) {
        selectedCircle = elem;
      }
    }

    if(selectedCircle === null) {
      return;
    }

    const pos = offset(selectedCircle);
    var tooltip = document.getElementById("forecasts-tooltip");
    tooltip.style.display = "block";
    tooltip.style.position = "absolute";
    tooltip.style.top = pos.top + "px";
    tooltip.style.left = pos.left + "px";

    tooltip.innerHTML = "Hello World!";
  }

  mouseOut(d, i) {
    var tooltip = document.getElementById("forecasts-tooltip").style.display = "none";
  }

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

    const columnSpec = [{
      header: "Year",
      accessor: "Year",
      id: "year"
    }, {
      header: "Month",
      accessor: "Month",
      id: "month"
    }, {
      header: "Point Forecast",
      accessor: props => Math.floor(props.Forecast),
      id: "pf"
    }, {
      header: "80% Confidence Range",
      accessor: props => <span>{Math.floor(props.Low_80)} to {Math.floor(props.High_80)}</span>,
      id: "conf-80"
    }];



    return (
      <div className='forecasts-panel'>
        <h3>{this.props.complaint_type}</h3>
        <div className="forecasts-chart">
          <div id="forecasts-tooltip" className="data-tooltip" />
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
            mouseover={this.mouseOver}
            mouseout={this.mouseOut}
          />
        </div>
        <div className="forecasts-table">
          <ReactTable
            data={this.props.data.forecasts}
            columns={columnSpec}
            showPagination={false}
            showPageSizeOptions={false}
            defaultPageSize={this.props.data.forecasts.length} />
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
