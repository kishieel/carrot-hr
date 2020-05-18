import React from 'react';
import { useSelector } from 'react-redux';
import ScheduleCellsGroup from './ScheduleCellsGroup.js'
import { chunk, workTimeSelector, getDatesFromPeriod, calculateTimeBase, isTimeFormatValid } from '../helpers'

const moment = require('moment')

const FreeDays = (props) => {
	const { employeeId } = props

	const { free_days, billing_period, billing_period_type } = useSelector( state => state.settings )

	const freeDaysAmount = { }
	Object.entries(free_days).forEach( ([key, freeDay]) => {
		if ( freeDay !== null ) {
			freeDaysAmount[ key ] = { index: freeDay.index, left: 0 }
		}
	})

	const dates = getDatesFromPeriod( billing_period, billing_period_type )
	dates.map( date => {
		let key = moment(date).format("ddd").toLowerCase()
		if ( freeDaysAmount[ key ] !== undefined ) {
			freeDaysAmount[ key ].left += 1
		}
	})

	let schedulesAmount = 0
	useSelector( state => Object.entries(state.schedules).filter( ([key, schedule]) => {
		const [ empId, dateId ] = key.split(':')

		return parseInt( employeeId ) === parseInt( empId )
	}) ).map( ([key, schedule]) => {
		const [ empId, dateId ] = key.split(':')

		Object.entries( freeDaysAmount ).forEach( ([key, freeDay]) => {
			if ( schedule.begin === freeDay.index ) {
				freeDaysAmount[ key ].left -= 1
			}
		})

		if ( schedule.begin !== "W" ) schedulesAmount += 1
	})

	let emptySchedulesAmount = dates.length - schedulesAmount
	Object.entries( freeDaysAmount ).forEach( ([key, freeDay]) => {
		emptySchedulesAmount -= freeDay.left
	})


	let thClassName = "text-center"
	let thContent = ""
	if ( emptySchedulesAmount < 0 ) {
		thClassName += " carrotHR__field--warning"
		thContent = "!"
		console.log( `Pracownik o ID : ${employeeId} - brak miejsca na zwrócenie dni wolnych ( S, N )`)
	}

	Object.entries( freeDaysAmount ).forEach( ([key, freeDay]) => {
		if ( freeDay.left !== 0 ) {
			thClassName += " carrotHR__field--danger"
			thContent = "?"
			console.log( `Pracownik o ID : ${employeeId} - nie wydano dni wolnych ( ${freeDay.index} : ${freeDay.left} )`)
		}
	})

	return (
		<th className={ thClassName }>{ thContent }</th>
	)
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
	const { employeeId, onSignatureClick } = props
	const { billing_period, billing_period_type } = useSelector( state => state.settings );
	const weeks = chunk( getDatesFromPeriod( billing_period, billing_period_type ), 7 )
	const employee = useSelector( state => state.employees[ employeeId ] ) || null

	return (
		<tr>
			<th className="text-center">{ props.no }</th>
			<th className="text-nowrap" onClick={ onSignatureClick }>{ employee.signature }</th>
			<TimeLeft employee_id={ employeeId }/>
			<FreeDays employeeId={ employeeId } />
			{ weeks.map(week => { return (
				<ScheduleCellsGroup key={ `schedule-group-[${week[0]}]-${employeeId}` } week={ week } employee_id={ employeeId } />
			)}) }
		</tr>
	)
}

export default ScheduleRow;
