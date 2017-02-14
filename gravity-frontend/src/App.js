import React, { Component } from 'react';
import logo from './logo.svg';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './App.css';


class App extends Component {

  handleSelect(index, last) {
    console.log('Selected tab: ' + index + ', Last tab: ' + last);
  }

  render() {
    return (
      <div className="App">
        <header className='header'></header>
        <div className='container'>

            <Tabs onSelect={this.handleSelect} selectedIndex={0}>
              <TabList>
                <Tab>Highlights</Tab>
                <Tab>Alerts</Tab>
                <Tab>Forecast</Tab>
              </TabList>
              <TabPanel>
                <div>
                  Highlights container
                </div>
              </TabPanel>
              <TabPanel>
                <div>
                  Alerts container
                </div>
              </TabPanel>
              <TabPanel>
                <div>
                  Forecast container
                </div>
              </TabPanel>
            </Tabs>


          <div className='row stats-row'>
            <label className='stat-label'>Summary</label>
            <div className='stat-tile'>
              <label>Label</label>
              <span>32</span>
            </div>
            <div className='stat-tile'>
              <label>Label</label>
              <span>1</span>
            </div>
          </div>

          <div className='row stats-row'>
            <label className='stat-label'>Alerts</label>
            <div className='stat-tile'>
              <label>Label</label>
              <span>32</span>
            </div>
            <div className='stat-tile'>
              <label>Label</label>
              <span>1</span>
            </div>
          </div>


          <div className='row stats-row'>
            <label className='stat-label'>Forecast</label>
            <div className='stat-tile'>
              <label>Label</label>
              <span>7</span>
            </div>
            <div className='stat-tile'>
              <label>Label</label>
              <span>1</span>
            </div>
          </div>

        </div>
        <footer>
          <a href='#'>About Us</a>
          <a href='#'>Credits</a>
          <a href='#'>Partners</a>
          <a href='#'>Fork this on GitHub</a>
        </footer>
      </div>
    );
  }
}

export default App;
