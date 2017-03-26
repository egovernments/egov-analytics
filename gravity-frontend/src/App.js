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
import 'react-table/react-table.css'

class App extends Component {

  handleSelect(index, last) {
    console.log('Selected tab: ' + index + ', Last tab: ' + last);
    // TODO dispatch events to redux as the tab changed
  }

 componentWillMount() {

      [
          { "type" : "UPDATE_HIGHLIGHTS" },
          { "type" : "UPDATE_FORECASTS" }
      ].forEach((e) => {
          store.dispatch(e);
      });

 }

  render() {
    return (
      <div className="App">
        <header className='header'></header>
        <div>

            <Tabs onSelect={this.handleSelect} selectedIndex={0}>
              <TabList>
                <Tab>Highlights</Tab>
                <Tab>Alerts</Tab>
                <Tab>Forecast</Tab>
              </TabList>
              <TabPanel>
                <HighlightsTab />
              </TabPanel>
              <TabPanel>
                <div className="container">
                  <AlertsTab />
                </div>
              </TabPanel>
              <TabPanel>
                  <div className="container">
                      <ForecastsTab />
                  </div>
              </TabPanel>
            </Tabs>


        </div>
        <footer>
          <a href='http://www.datakind.org/chapters/datakind-blr' target="_blank"><img src={egov_logo} height="30px" className="vertical-middle"/></a>
          <a href='http://www.datakind.org/chapters/datakind-blr' target="_blank"><img src={dk_logo} height="25px" className="vertical-middle"/></a>
          <a href='https://github.com/egovernments/analytics/blob/master/CONTRIBUTORS.md' target="_blank">Contributors</a>
          <a href='https://github.com/egovernments/analytics/' target="_blank">GitHub</a>
        </footer>
      </div>
    );
  }
}


export default App;
