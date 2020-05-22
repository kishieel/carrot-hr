import React from 'react'
import Navigation from './navigation/Navigation'
import Schedules from './schedules/Schedules'
import EmployeeSettings from './employeeSettings/EmployeeSettings'

// require('moment/locale/pl')

const App = ( props ) => {
	return (<>
		<Navigation />
		<Schedules />
		<EmployeeSettings />
	</>)
}

export default App
