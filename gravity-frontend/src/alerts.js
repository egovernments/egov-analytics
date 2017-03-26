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
    var selectValue = e.target.value,
        dateStart = null,
        dateEnd = null;

    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_date_range: selectValue
    });

    dateEnd = new Date();
    if(selectValue === "last_day") {
      dateStart = moment(dateEnd).subtract(1, "days").toDate();
    } else if (selectValue === "last_week") {
      dateStart = moment(dateEnd).subtract(7, "days").toDate();
    } else if (selectValue === "last_month") {
      dateStart = moment(dateEnd).subtract(30, "days").toDate();
    } else if (selectValue === "last_year") {
      dateStart = moment(dateEnd).subtract(365, "days").toDate();
    } else if (selectValue === "custom") {
      return;
    }

    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_date_start: dateStart,
      selected_date_end: dateEnd
    });
  }

  categoryTypeSelectionOnChange(e) {
    var newCategoryType = e.target.value;
    if(newCategoryType === "ward") {
      store.dispatch({
        type: "ALERTS_UPDATE_STATE",
        categoryType: newCategoryType,
        selected_ward: this.props.wards[0]
      });
    } else if (newCategoryType === "complaint") {
      store.dispatch({
        type: "ALERTS_UPDATE_STATE",
        categoryType: newCategoryType,
        selected_complaint_type: this.props.complaint_types[0]
      });
    } else {
      store.dispatch({
        type: "ALERTS_UPDATE_STATE",
        categoryType: newCategoryType
      });
    }

  }

  wardSelectionHandler(e) {
    var select = e.target,
        selectValue = select[select.selectedIndex].value || null;
    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      selected_ward: selectValue,
      selected_complaint_type: null
    });
  }

  complaintTypeSelectionHandler(e) {
    var select = e.target,
        selectValue = select[select.selectedIndex].value || null;
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

    // if date type is custom, show this
    var customDateRange = null;
    if(this.props.selected_date_range === "custom") {
      customDateRange = [
        <DateField
          id="start_date"
          key="start_date"
          dateFormat="YYYY-MM-DD"
          defaultValue={moment(this.props.selected_date_start).format("YYYY-MM-DD")}
          onChange={this.dateStartChange} />,
        <DateField
            id="end_date"
            key="end_date"
            dateFormat="YYYY-MM-DD"
            defaultValue={moment(this.props.selected_date_end).format("YYYY-MM-DD")}
            onChange={this.dateEndChange} />
      ];
    } else {
        customDateRange = [];
    }


    var categoryOptions = null;
    if( this.props.categoryType === "ward" ) {
      categoryOptions =  <select id='wardOptions' onChange={this.wardSelectionHandler}>
                          {ward_options}
                         </select>;
    } else if ( this.props.categoryType === "complaint" ) {
      categoryOptions = <select id='complaintOptions' onChange={this.complaintTypeSelectionHandler}>
                          {ct_options}
                        </select>;
    }

    return (
      <div id="select-panel">
        <div className="alert-filters">
          <div>
            <input type="radio" name="filterType" id="ft-all" value="all"
              checked={this.props.categoryType === "all"}
              onChange={this.categoryTypeSelectionOnChange.bind(this)}/>
            <label htmlFor="ft-all">All</label>
            <input type="radio" name="filterType" id="ft-ward" value="ward"
              checked={this.props.categoryType === "ward"}
              onChange={this.categoryTypeSelectionOnChange.bind(this)} />
            <label htmlFor="ft-ward">Ward No.</label>
            <input type="radio" name="filterType" id="ft-complaint"
              value="complaint" checked={this.props.categoryType === "complaint"}
              onChange={this.categoryTypeSelectionOnChange.bind(this)}/>
            <label htmlFor="ft-complaint">Complaint type</label>
            { categoryOptions }
          </div>
        </div>
        <div className="alert-time-filters">
          <button className={this.props.selected_date_range === "last_day" ? "active-time-filter" : ""}
            onClick={this.dateSelectionOnChange} value="last_day">1D</button>
          <button className={this.props.selected_date_range === "last_week" ? "active-time-filter" : ""}
            onClick={this.dateSelectionOnChange} value="last_week">7D</button>
          <button className={this.props.selected_date_range === "last_month" ? "active-time-filter" : ""}
            onClick={this.dateSelectionOnChange} value="last_month">30D</button>
          <button className={this.props.selected_date_range === "last_year" ? "active-time-filter" : ""}
            onClick={this.dateSelectionOnChange} value="last_year">YTD</button>
          <button className={this.props.selected_date_range === "custom" ? "active-time-filter" : ""}
            onClick={this.dateSelectionOnChange} value={"custom"}>Custom</button>
          {customDateRange}
        </div>
      </div>
    );
  }
}


class ChartAndTablePanel extends Component {
    constructor() {
      super();
      this.state = {
        chartViewType: "chart"
      };
    }
    toggleChartView() {
      var newViewType = this.state.chartViewType === "chart" ? "table" : "chart";
      this.setState(Object.assign({}, this.state, {chartViewType: newViewType}));
    }

  render() {
    var data = [],
        dateToCount = {},
        dateStart = this.props.selected_date_start,
        dateEnd = this.props.selected_date_end;

    if( dateStart >= dateEnd ) {
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
          <h3 className="alerts-chart-title">Showing data from {this.props.selected_date_start.toDateString()}
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

        anomsForTable.push({
          date: moment(date).format("MMMM Do YYYY, h a"),
          count: dateToCount[d]
        });
      }
    });

    const columnSpec = [{
      header: 'Time',
      accessor: 'date'
    }, {
      header:'Number of Complaints',
      accessor: 'count'
    }];

    var view = null;

    var parentTab = document.getElementById("alerts-tab");
    var width = 600;
    if(parentTab) {
      width = parentTab.offsetWidth;
    }

    if(this.state.chartViewType === "chart") {
      view = <MetricsGraphics
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
          min_y={0}/>;
    } else {
      view =   <ReactTable
          data={anomsForTable}
          columns={columnSpec} />;
    }

    return (
      <div id="chart-panel">
        <h3 className="alerts-chart-title">{this.props.selected_date_start.toDateString() } - {this.props.selected_date_end.toDateString()}</h3>
        <div>
          <label className="alerts-chart-stat">
            Complaints: {this.props.complaints_count} | Anomalies: {this.props.anomalies_count}
            <a href="javascript:void(0)" onClick={this.toggleChartView.bind(this)} className="toggle-alerts-view">List anomalies</a>
          </label>

        </div>
          {view}
      </div>
    );
  }
}


class AlertsTab extends Component {
  componentWillMount() {
    store.dispatch({
      type: "ALERTS_UPDATE_STATE",
      force_call: true
    })
  }


  render() {

    // var highlights = this.props.highlights.alerts.map(function(highlight) {
    //   // TODO there should be a tool tip for description
    //   return(
    //     <div className="stat-box" key={highlight.name} >
    //       <span>{highlight.value}</span>
    //       <label>{highlight.name}</label>
    //     </div>
    //   );
    // });
    // <div className="col-small"> className="col-large"
    //   {highlights}
    // </div>

    return (
      <div id="alerts-tab">
        <div>
          <SelectPanel wards={this.props.wards}
            complaint_types={this.props.complaint_types}
            selected_ward={this.props.selected_ward}
            selected_complaint_type={this.props.selected_complaint_type}
            selected_date={this.props.selected_date}
            selected_hour={this.props.selected_hour}
            selected_date_range={this.props.selected_date_range}
            categoryType={this.props.categoryType} />
          <ChartAndTablePanel selected_date_start={this.props.selected_date_start}
            selected_date_end={this.props.selected_date_end}
            data={this.props.current_data}
            anomalies={this.props.current_anomalies}
            complaints_count={this.props.complaints_count}
            anomalies_count={this.props.anomalies_count} />
        </div>

        <div className="spacer"></div>
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
    current_anomalies: store.alerts.current_anomalies,
    categoryType: store.alerts.categoryType,
    anomalies_count: store.alerts.anomalies_count,
    complaints_count: store.alerts.complaints_count
  };
}


export default connect(mapStateToProps)(AlertsTab);
