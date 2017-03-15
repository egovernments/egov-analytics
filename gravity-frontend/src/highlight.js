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

  render() {
    var url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    var attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';
    const mapCenter = [13.0827, 80.2707];
    const zoomLevel = 10.5;

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



class HighlightsTab extends Component {
  render() {
    return (
      <div>
        <MapPanel ward_geo_json={this.props.ward_geo_json} />
        <HighlightsPanel label='summary' highlights={this.props.highlights.general} ></HighlightsPanel>
        <HighlightsPanel label='alerts' highlights={this.props.highlights.alerts}></HighlightsPanel>
        <HighlightsPanel label='forecasts' highlights={this.props.highlights.forecasts}></HighlightsPanel>
      </div>
    );
  }
}



const mapStateToProps = function(store) {
  return {
    highlights: store.highlights,
    ward_geo_json: store.alerts.ward_geo_json
  };
}

export {HighlightsPanel};
export default connect(mapStateToProps)(HighlightsTab);
