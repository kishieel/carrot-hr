import React from 'react';
import { useSelector } from 'react-redux';
import ScheduleCellsGroup from './ScheduleCellsGroup.js'
import { chunk, getDatesFromPeriod, calculateTimeBase, isTimeFormatValid } from '../helpers'

const moment = require('moment')

const workTimeSelector = (schedules, employee_id) => {
	let work_time = 0
	Object.entries(schedules).filter((key, obj) => {
		let e = parseInt( `${key}`.split(":")[0] )
		return e === parseInt( employee_id );
	}).map(([key, obj]) => {
		if ( isTimeFormatValid( obj.begin ) === true && isTimeFormatValid( obj.cease ) === true ) {
			let date = `${key}`.split(":")[1]
			let beginDate = moment(`${date} ${obj.begin}`)
			let ceaseDate = moment(`${date} ${obj.cease}`)

			let diff = ceaseDate.diff( beginDate, 'hours', true )
			work_time += diff
		}
	})
	return work_time;
}

const TimeLeft = (props) => {
	const employee = useSelector( state => state.employees[ props.employee_id ])

	const { billing_period, billing_period_type, free_days } = useSelector( state => state.settings );
	let time_left = calculateTimeBase( billing_period, billing_period_type, free_days ) * employee.time_contract

	const work_time = useSelector( state => workTimeSelector(state.schedules, props.employee_id) )
	time_left -= work_time

	let timeLeftClassName = "text-center"
	if ( time_left < 0 ) timeLeftClassName += " carrotHR__field--warning"
	if ( time_left > 0 ) timeLeftClassName += " carrotHR__field--danger"

	time_left = Math.floor( time_left * 100 ) / 100

	return (
		<th className={ timeLeftClassName }>{ time_left }</th>
	)
}

const ScheduleRow = (props) => {
	const { billing_period, billing_period_type } = useSelector( state => state.settings );
	const weeks = chunk( getDatesFromPeriod( billing_period, billing_period_type ), 7 )

	return (
		<tr>
			<th className="text-center">{ props.no }</th>
			<th className="text-nowrap" onClick={ props.onSignatureClick }>{ props.employee.signature }</th>
			<TimeLeft employee_id={ props.employee_id }/>
			{ weeks.map(week => { return (
				<ScheduleCellsGroup key={ `schedule-group-[${week[0]}]-${props.employee_id}` } week={ week } employee_id={ props.employee_id } />
			)}) }
		</tr>
	)
}

export default ScheduleRow;
