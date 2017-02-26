import React, { Component } from 'react';

class HighlightPill extends Component {

  render() {
    return (
        <div className='stat-tile'>
          <label>{this.props.label}</label>
          <span>{this.props.value}</span>
        </div>
    )
  }

}

export default HighlightPill;
