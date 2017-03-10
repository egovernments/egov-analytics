import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import HighlightsTab from './highlight.js';
import AlertsTab from './alerts.js';
import './App.css';
import { store } from "./redux_store.js";
import ForecastsTab from './forecast.js';
import "./metricsgraphics.css";
import "./metricsgraphics_dark.css";
import dk_logo from "./DataKindBLR.png";
import egov_logo from "./egov-logo.png";

class App extends Component {

  handleSelect(index, last) {
    console.log('Selected tab: ' + index + ', Last tab: ' + last);
    // TODO dispatch events to redux as the tab changed
  }

 componentWillMount() {
   store.dispatch({
     "type" : "UPDATE_HIGHLIGHTS"
   });

   store.dispatch({
     "type" : "UPDATE_FORECASTS"
   });
 }

  render() {
    return (
      <div className="App">
        <header className='header'></header>
        <div className='container'>

            <Tabs onSelect={this.handleSelect} selectedIndex={0}>
              <TabList>
                <Tab>Highlights</Tab>
                <Tab>Alerts<span className='tab-num-stat'>32</span></Tab>
                <Tab>Forecast</Tab>
              </TabList>
              <TabPanel>
                <HighlightsTab />
              </TabPanel>
              <TabPanel>
                <div>
                  <AlertsTab />
                </div>
              </TabPanel>
              <TabPanel>
                <ForecastsTab />
              </TabPanel>
            </Tabs>


        </div>
        <footer>
          <a href='http://www.datakind.org/chapters/datakind-blr'><img src={egov_logo} height="30px" className="vertical-middle"/></a>
          <a href='http://www.datakind.org/chapters/datakind-blr'><img src={dk_logo} height="25px" className="vertical-middle"/></a>
          <a href='https://github.com/egovernments/analytics/blob/master/CONTRIBUTORS.md'>Contributors</a>
          <a href='https://github.com/egovernments/analytics/'>GitHub</a>
        </footer>
      </div>
    );
  }
}


export default App;
