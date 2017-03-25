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


  dateSelectionOnChange(e) {
    var select = e.target;
    var selectValue = select[select.selectedIndex].value;

    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_date_range: selectValue
    });

    var dateStart = null;
    var dateEnd = null;

    if(selectValue === "last_day") {
      dateEnd = new Date();
      dateStart = moment(dateEnd).subtract(1, "days").toDate();
    } else if (selectValue === "last_week") {
      dateEnd = new Date();
      dateStart = moment(dateEnd).subtract(7, "days").toDate();
    } else if (selectValue === "last_month") {
      dateEnd = new Date();
      dateStart = moment(dateEnd).subtract(30, "days").toDate();
    } else if (selectValue === "custom") {
      return;
    }


    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_date_start: dateStart,
      selected_date_end: dateEnd
    });

  }

  changeDataType(e){
    console.log(e);
  }

  filters = {

    filterType : "week",

    time : {
      activeType : "week"
    }

  }



    changeTimeFilter(d){
      this.filters.time.activeType = d;
    }

  filterType = "ward";


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


  dateStartChange(dateString, {dateMoment, timestamp}) {
    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_date_start: dateMoment.toDate()
    });
  }

  dateEndChange(dateString, {dateMoment, timestamp}) {
    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_date_end: dateMoment.toDate()
    });
  }

  render() {
    var ward_options = this.props.wards.map(function(w) {
      return (<option key={w} value={w} >{w}</option>);
    });

    var ct_options = this.props.complaint_types.map(function(c) {
      return (<option key={c} value={c} >{c}</option>);
    });

    var customDateRange = [];
    if(this.props.selected_date_range === "custom") {
      customDateRange.push(
        <DateField
          id="start_date"
          key="start_date"
          dateFormat="YYYY-MM-DD"
          defaultValue={this.props.selected_date_start}
          onChange={this.dateStartChange} />
      );

      customDateRange.push(
        <DateField
          id="end_date"
          key="end_date"
          dateFormat="YYYY-MM-DD"
          defaultValue={this.props.selected_date_end}
          onChange={this.dateEndChange} />
      );
    }

    return (
      <div id="select-panel">

        <div className="alert-filters">
          <input type="radio" name="filterType" id="ft-all" value="all" checked={this.filterType === "all"} onChange={this.changeDataType} />
          <label htmlFor="ft-all">All</label>
          <input type="radio" name="filterType" id="ft-ward" value="ward" checked={this.filterType === "ward"} onChange={this.changeDataType}  />
          <label htmlFor="ft-ward">Ward No.</label>
          <input type="radio" name="filterType" id="ft-complaint" value="complaint" checked={this.filterType === "complaint"} onChange={this.changeDataType}  />
          <label htmlFor="ft-complaint">Complaint type</label>

          <select>
            <option>Lorem Epsum</option>
          </select>
        </div>

        <div className="alert-time-filters">
          <button className={this.filters.time.activeType === "today" ? "active-time-filter" : ""} onClick={()=>this.changeTimeFilter("today")}>Today</button>
          <button className={this.filters.time.activeType === "week" ? "active-time-filter" : ""} onClick={()=>this.changeTimeFilter("week")}>Last 7 days</button>
          <button className={this.filters.time.activeType === "month" ? "active-time-filter" : ""}  onClick={()=>this.changeTimeFilter("month")}>Last 30 days</button>
          <button className={this.filters.time.activeType === "year" ? "active-time-filter" : ""}  onClick={()=>this.changeTimeFilter("year")}>Last year</button>
          <button className={this.filters.time.activeType === "custom" ? "active-time-filter" : "", "custom-time"}  onClick={()=>this.changeTimeFilter("custom")}>Custom</button>
          {customDateRange}
        </div>

          <br/><br/><br/>
          <select id="ward-selector" onChange={this.wardSelectionHandler}>
            <option value=""></option>
            {ward_options}
          </select>
          <select id="complaint-type-selector" onChange={this.complaintTypeSelectionHandler}>
            <option value=""></option>
            {ct_options}
          </select>
          <select id="date-select" onChange={this.dateSelectionOnChange}>
            <option value="last_week">Last Week</option>
            <option value="last_day">Last Day</option>
            <option value="last_month">Last 30 days</option>
            <option value="custom">Custom Date Range</option>
          </select>
          {customDateRange}
      </div>
    );
  }
}


class ChartAndTablePanel extends Component {
  render() {
    var data = [];

    console.log("End Date : " +  this.props.selected_date_end);
    console.log("Start Date : " + this.props.selected_date_start);

    var dateToCount = {};

    var dateStart = this.props.selected_date_start;
    var dateEnd = this.props.selected_date_end;

    if(dateStart >= dateEnd) {
      return(
        <div>
          <h3>Start date should come before end date </h3>
        </div>
      );
    }

    this.props.data.forEach(function(d) {
      var date = new Date(d.Time);

      if(date >= dateStart && date <= dateEnd) {
        data.push({
          value : d.Data,
          date: date
        });

        dateToCount[d.Time] = d.Data;
      }
    });

    if( !data.length ) {
      return (
        <div>
          <h3>Showing data from {this.props.selected_date_start.toDateString()}
            to {this.props.selected_date_end.toDateString()}</h3>
          <h5>No data available for the selected date</h5>
        </div>
      );
    }

    var markers = [];

    var anomsForTable = [];

    this.props.anomalies.forEach(function(d) {
      var date = new Date(d);

      if(date >= dateStart && date <= dateEnd) {
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
      }
    });

    //console.log(anomsForTable);

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
        <h3>Showing data from {this.props.selected_date_start.toDateString()}
            to {this.props.selected_date_end.toDateString()}</h3>
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
          selected_hour={this.props.selected_hour}
          selected_date_range={this.props.selected_date_range} />
        <ChartAndTablePanel selected_date_start={this.props.selected_date_start}
          selected_date_end={this.props.selected_date_end}
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
    selected_date_range: store.alerts.selected_date_range,
    selected_date_start: store.alerts.selected_date_start,
    selected_date_end: store.alerts.selected_date_end,
    current_data: store.alerts.current_data,
    current_anomalies: store.alerts.current_anomalies
  };
}


export default connect(mapStateToProps)(AlertsTab);
