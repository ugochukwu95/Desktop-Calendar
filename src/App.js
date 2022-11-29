import React, { Component } from 'react';
import './App.css';
import { NativeCalendar } from './NativeCalendar/NativeCalendar';
import { Sidenav } from './Sidenav/Sidenav';

class App extends Component {
    render() {
        return <div className='app_cont'>
            {
            /**
             * Left section of the app with navigation links
             */
            }
            <Sidenav />

            {
            /**
             * Calendar section
             */
            }
            <NativeCalendar />
        </div>
    }
}

export default App;
