import React, { Component } from 'react';
import { store } from "./redux_store.js";
import { connect } from 'react-redux';
import { HighlightsPanel } from "./highlight.js";
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';



class SelectPanel extends Component {
  render() {
    var ward_options = this.props.wards.map(function(w) {
      return (<option key={w} value={w} >{w}</option>);
    });

    var ct_options = this.props.complaint_types.map(function(c) {
      return (<option key={c} value={c} >{c}</option>);
    });

    return (
      <div id="select-panel">
          <select id="ward-selector">
            <option value=""></option>
            {ward_options}
          </select>
          <select id="complaint-type-selector">
            <option value=""></option>
            {ct_options}
          </select>
      </div>
    );
  }
}


class MapPanel extends Component {

  componentWillMount() {
  }

  render() {
    var url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    var attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    const mapCenter = [13.0827, 80.2707];
    const zoomLevel = 10.5;

    console.log(this.props.ward_geo_json);

    return(
      <div>
        <Map id="ward-map"
          center={mapCenter}
          zoom={zoomLevel} >
          <TileLayer
            attribution={attribution}
            url={url} />
          <GeoJSON
            data={this.props.ward_geo_json} />
        </Map>
      </div>
    );
  }
}


class AlertsTab extends Component {

  render() {
    // todo include this
    return (
      <div id="alerts-tab">
        <HighlightsPanel label='alerts' highlights={this.props.highlights.alerts}></HighlightsPanel>
        <SelectPanel wards={this.props.wards}
          complaint_types={this.props.complaint_types}
          selected_ward={this.props.selected_ward}
          selected_complaint_type={this.props.selected_complaint_type} />
        <MapPanel ward_geo_json={this.props.ward_geo_json}/>
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
    ward_geo_json: store.alerts.ward_geo_json
  };
}


export default connect(mapStateToProps)(AlertsTab);
