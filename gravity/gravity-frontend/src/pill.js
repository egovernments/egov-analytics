import React, { Component } from 'react';

class HighlightPill extends Component {

  render() {
    return (
        <div className='stat-tile'>
          <span>{this.props.value}</span>
          <label>{this.props.label}</label>
        </div>
    )
  }

}

export default HighlightPill;
