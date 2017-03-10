import React, { Component } from 'react';
import HighlightPill from './pill.js';
import { store } from "./redux_store.js";
import { connect } from 'react-redux';

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


class HighlightsTab extends Component {
  render() {
    return (
      <div>
        <HighlightsPanel label='summary' highlights={this.props.highlights.general} ></HighlightsPanel>
        <HighlightsPanel label='alerts' highlights={this.props.highlights.alerts}></HighlightsPanel>
        <HighlightsPanel label='forecasts' highlights={this.props.highlights.forecasts}></HighlightsPanel>
      </div>
    );
  }
}



const mapStateToProps = function(store) {
  return {
    highlights: store.highlights
  };
}

export {HighlightsPanel};
export default connect(mapStateToProps)(HighlightsTab);
