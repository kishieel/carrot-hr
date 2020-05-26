import React, { Component } from 'react';
import Navigation from './Navigation';
import Schedule from './Schedule';

class App extends Component {
	render() {
		return ( <>
			<Navigation />
			<Schedule />
		</> );
	}
}

export default App;
