import React, { Component } from 'react';
import { store } from "./redux_store.js";
import { connect } from 'react-redux';
import { HighlightsPanel } from "./highlight.js";
import 'react-date-picker/index.css';
import { DateField, Calendar } from 'react-date-picker';
import MetricsGraphics from 'react-metrics-graphics';
import moment from 'moment';
import MG from 'metrics-graphics';
import ReactTable from 'react-table'

class SelectPanel extends Component {

  dateSelectionHandler(dateString, { dateMoment, timestamp }) {
    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_date: dateMoment.toDate()
    });
  }

  wardSelectionHandler(e) {
    console.log("Ward Changed");
    var select = e.target;

    var selectValue = select[select.selectedIndex].value;
    if(selectValue === "") {
      selectValue = null;
    }

    // set complaint_type to ""
    document.getElementById("complaint-type-selector").selectedIndex = 0;

    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_ward: selectValue,
      selected_complaint_type: null
    });
  }

  complaintTypeSelectionHandler(e) {
    console.log("Complaint Type Changed");
    var select = e.target;

    var selectValue = select[select.selectedIndex].value;
    if(selectValue === "") {
      selectValue = null;
    }

    // set complaint_type to ""
    document.getElementById("ward-selector").selectedIndex = 0;

    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_ward: null,
      selected_complaint_type: selectValue
    });
  }

  render() {
    var ward_options = this.props.wards.map(function(w) {
      return (<option key={w} value={w} >{w}</option>);
    });

    var ct_options = this.props.complaint_types.map(function(c) {
      return (<option key={c} value={c} >{c}</option>);
    });


    return (
      <div id="select-panel">
          <select id="ward-selector" onChange={this.wardSelectionHandler}>
            <option value=""></option>
            {ward_options}
          </select>
          <select id="complaint-type-selector" onChange={this.complaintTypeSelectionHandler}>
            <option value=""></option>
            {ct_options}
          </select>
          <DateField
            dateFormat="YYYY-MM-DD"
            defaultValue={this.props.selected_date}
            onChange={this.dateSelectionHandler} />
      </div>
    );
  }
}


class ChartAndTablePanel extends Component {
  render() {
    var data = [];
    const daysAfter = 5;
    const daysBefore = 15;


    const dateBefore = moment(this.props.selected_date)
                        .subtract(daysBefore, 'days').toDate();
    const dateAfter = moment(this.props.selected_date)
                        .add(daysAfter, 'days').toDate();

    console.log(dateBefore);
    console.log(dateAfter);

    var dateToCount = {};

    this.props.data.forEach(function(d) {
      var date = new Date(d.Time);
      if(date > dateAfter) {
        return;
      }
      if(date < dateBefore) {
        return;
      }
      data.push({
        value : d.Data,
        date: date
      });

      dateToCount[d.Time] = d.Data;
    });

    if(data.length == 0) {
      return (<div><h5>No data available for the selected date</h5></div>);
    }

    var markers = [{
        'date': this.props.selected_date,
        'label': 'Selected Date'
    }];

    var anomsForTable = [];

    this.props.anomalies.forEach(function(d) {
      var date = new Date(d);
      if(date > dateAfter) {
        return;
      }
      if(date < dateBefore) {
        return;
      }
      markers.push({
        date: date,
        label: "",
        value: 30
      });

      var formattedDate = moment(date).format("MMMM Do YYYY, h a");

      anomsForTable.push({
        date: formattedDate,
        count: dateToCount[d]
      });
    });

    console.log(anomsForTable);

    const columnSpec = [{
      header: 'Time',
      accessor: 'date'
    }, {
      header:'Number of Complaints',
      accessor: 'count'
    }];

    var parentTab = document.getElementById("alerts-tab");
    var width = 600;
    if(parentTab) {
      width = parentTab.offsetWidth;
    }
    return (
      <div id="chart-panel">
        <MetricsGraphics
          title="Downloads"
          description="This graphic shows a time-series of downloads."
          markers={markers}
          data={data}
          width={width}
          height={250}
          x_accessor="date"
          y_accessor="value"
          transition_on_update={false}
          area={false}
          min_x={dateBefore}
          max_x={dateAfter}
          min_y={0}/>
        <ReactTable
          data={anomsForTable}
          columns={columnSpec} />
      </div>
    );
  }
}

class AnomaliesTable {

}

class AlertsTab extends Component {
  componentWillMount() {
    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      force_call: true
    })
  }
  render() {
    // todo include this
    // <MapPanel ward_geo_json={this.props.ward_geo_json} />
    return (
      <div id="alerts-tab">
        <HighlightsPanel label='alerts'
          highlights={this.props.highlights.alerts}/>
        <SelectPanel wards={this.props.wards}
          complaint_types={this.props.complaint_types}
          selected_ward={this.props.selected_ward}
          selected_complaint_type={this.props.selected_complaint_type}
          selected_date={this.props.selected_date}
          selected_hour={this.props.selected_hour} />
        <ChartAndTablePanel selected_date={this.props.selected_date}
          data={this.props.current_data}
          anomalies={this.props.current_anomalies} />
      </div>
    );
  }
}
const mapStateToProps = function(store) {
  return {
    highlights: store.highlights,
    wards : store.alerts.wards,
    complaint_types: store.alerts.complaint_types,
    selected_ward: store.alerts.selected_ward,
    selected_complaint_type: store.alerts.selected_complaint_type,
    selected_date: store.alerts.selected_date,
    current_data: store.alerts.current_data,
    current_anomalies: store.alerts.current_anomalies
  };
}


export default connect(mapStateToProps)(AlertsTab);
