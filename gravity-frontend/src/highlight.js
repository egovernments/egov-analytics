import React, { Component } from 'react';
import HighlightPill from './pill.js';
import { store } from "./redux_store.js";
import { connect } from 'react-redux';
import 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';

class HighlightsPanel extends Component {

  componentWillMount(){
  }

  render() {

    var highlights = [];

    if(this.props.highlights !== undefined) {
      for (var i = 0; i < this.props.highlights.length; i++) {
        var h = this.props.highlights[i];
        highlights.push(<HighlightPill key={i} label={h.name} value={h.value}
          description={h.description} className=""  />)
      }
    }

    return (
      <div className='row stats-row'>
        <label className='stat-label'>{this.props.label}</label>
        {highlights}
      </div>
    )
  }

}


class MapPanel extends Component {

  componentWillMount() {
  }

  mapStyle(feature) {
    console.log(feature.properties);
    return {
      fillColor: '#FC4E2A',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }

  hourSelectOnChange(e) {
    var value = e.target.value;
    console.log("Hour Selected: " + value);
  }

  render() {
    var url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    var attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    const mapCenter = [13.0827, 80.2707];
    const zoomLevel = 10.5;

    return(
      <div className="content-wrapper-fixed-height">
        <input id="hour_select" type="range" min="0" max="24" step="1" onChange={this.hourSelectOnChange} />
        <Map id="ward-map"
          center={mapCenter}
          zoom={zoomLevel} >
          <TileLayer
            attribution={attribution}
            url={url} />
          <GeoJSON
            data={this.props.ward_geo_json}
            style={this.mapStyle} />
        </Map>
        <div className="summary-stats-container">
          <div className="stat-category">
            <h3>Summary</h3>
            <div>
              <span>32</span>
              <label>Alerts in the hour</label>
            </div>
            <div>
              <span>32</span>
              <label>Alerts in the week</label>
            </div>
            <div>
              <span>32</span>
              <label>Alerts in the month</label>
            </div>
          </div>
          <div className="stat-category">
            <h3>Alerts</h3>
            <div>
              <span>32</span>
              <label>Label</label>
            </div>
          </div>
          <div className="stat-category">
            <h3>Forecast</h3>
            <div>
              <span>32</span>
              <label>Label</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}



class HighlightsTab extends Component {
  render() {
    return (
      <div>
        <MapPanel ward_geo_json={this.props.ward_geo_json} />
      </div>
    );
  }
}

/*

 <HighlightsPanel label='summary' highlights={this.props.highlights.general} ></HighlightsPanel>
 <HighlightsPanel label='alerts' highlights={this.props.highlights.alerts}></HighlightsPanel>
 <HighlightsPanel label='forecasts' highlights={this.props.highlights.forecasts}></HighlightsPanel>
 */



const mapStateToProps = function(store) {
  return {
    highlights: store.highlights,
    ward_geo_json: store.ward_map.ward_geo_json
  };
}

export {HighlightsPanel};
export default connect(mapStateToProps)(HighlightsTab);
