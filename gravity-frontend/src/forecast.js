import React, { Component } from 'react';
import { store } from "./redux_store.js";
import { connect } from 'react-redux';
import { HighlightsPanel } from "./highlight.js";
import MetricsGraphics from 'react-metrics-graphics';
import ReactTable from 'react-table';
import moment from 'moment';

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
    var dateString = moment(d.date).format("MMMM YYYY");
    if(d.upper) {
      // d.upper is defined only for forecasts, different tool tip for it
      tooltip.innerHTML = "Forecast " + dateString + ": " + d.value;
    } else {
      tooltip.innerHTML =  dateString + ": " + d.value;
    }

    var width = tooltip.getBoundingClientRect().width;

    tooltip.style.top = (pos.top - 70)+ "px";
    tooltip.style.left = (pos.left - width / 2)+ "px";

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

    var markers = [{
        'date': new Date(),
        'label': 'Today'
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
            y_extended_ticks={true}
            x_label={"Time"}
            y_label={"Complaints"}
            show_rollover_text={false}
            height={250}
            x_accessor="date"
            y_accessor="value"
            show_confidence_band = {["upper", "lower"]}
            color_accessor={"color"}
            area={false}
            mouseover={this.mouseOver}
            mouseout={this.mouseOut}
            markers={markers}
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

  constructor() {
    super();
    this.state = {
      currentComplaint: null
    };
  }

  componentWillMount() {
    this.setState({
      currentComplaint: Object.keys(this.props.forecasts)[0]
    });
  }

  showForecastFor(e){
    this.setState({
      currentComplaint: e.target.innerHTML
    });
  }


  render() {
    var panel = null,
        complaintTypeButtons = [];

    var currentComplaint = this.state.currentComplaint;
    for (var key in this.props.forecasts) {
      if ( !this.props.forecasts.hasOwnProperty(key) ) {
        continue;
      }

      if(key === currentComplaint) {
        panel = <ForecastsPanel key={key} complaint_type={key} data={this.props.forecasts[key]} />;
        complaintTypeButtons.push(
          <li className="active-filter" onClick={this.showForecastFor.bind(this)}>{key}</li>
        );
      } else {
        complaintTypeButtons.push(
          <li onClick={this.showForecastFor.bind(this)}>{key}</li>
        );
      }




    }

    return (
      <div>
        <ul className="filter-buttons-container">
          {complaintTypeButtons}
        </ul>
        {panel}
      </div>
    );
  }
}

/*
  <HighlightsPanel label='forecasts' highlights={this.props.highlights.forecasts}></HighlightsPanel>
*/


const mapStateToProps = function(store) {
  return {
    highlights: store.highlights,
    forecasts : store.forecasts
  };
}


export default connect(mapStateToProps)(ForecastsTab);
