import React from 'react';
import { useSelector } from 'react-redux';
import ScheduleCell from './ScheduleCell.js'
import { isTimeFormatValid } from '../helpers'

const moment = require('moment')
// const weekSchedulesSelector = ( schedules, dates, employee_id ) => {
// 	let week_schedules = [];
// 	dates.map( date => {
// 		let schedule = schedules[`${employee_id}:${date}`]
// 		if( schedule !== null ) week_schedules.push( schedule )
// 	})
// 	return week_schedules
// }

// const weekSchedulesSelector

// waliduje tydzien
const ScheduleCellsGroup = React.memo((props) => {
	const { week, employee_id } = props
	const { weekly_break } = useSelector ( state => state.settings )

	const week_schedules = {}
	week.map( date => {
		const schedule_id = `${employee_id}:${date}`
		const schedule = useSelector( state => state.schedules[ schedule_id ] ) || null
		if ( schedule !== null ) week_schedules[ schedule_id ] = schedule
	} )

	let preventSchedule = null
	let currentSchedule = null
	let preventScheduleCease = moment( `${week[0]} 0:00`)
	let currentScheduleBegin = null
	let isWeeklyBreakMet = false
	let kurwesyn = week[0]
	for ( const date of week ) {
		if ( currentSchedule !== null ) {
			preventSchedule = currentSchedule
			if ( preventSchedule !== null && isTimeFormatValid( preventSchedule.cease ) === true ) {
				preventScheduleCease = moment( `${kurwesyn} ${preventSchedule.cease}` )
			}
		}
		console.log(`${employee_id}:${date}`)
		currentSchedule = week_schedules[ `${employee_id}:${date}`] || null
		kurwesyn = date

		if ( date !== week[0] ) {
			if ( currentSchedule !== null && isTimeFormatValid( currentSchedule.begin ) === true ) {
				currentScheduleBegin = moment( `${date} ${currentSchedule.begin}` )
			} else {
				currentScheduleBegin = moment( `${date} 24:00` )
			}

			let diff = currentScheduleBegin.diff( preventScheduleCease, 'hours', true )
			console.log(preventScheduleCease.format("YYYY-MM-DD HH:ss"), currentScheduleBegin.format("YYYY-MM-DD HH:ss"), diff)
			if ( diff >  moment.duration(weekly_break).asHours() ) {
				isWeeklyBreakMet = true
				break
			}
		}
	}

	return (<>
		{ props.week.map(date => { return (
			<ScheduleCell key={ `schedule-cell-${date}-${props.employee_id}` } date={ date } employee_id={ props.employee_id } isWeeklyBreakMet={ isWeeklyBreakMet } />
		) } ) }
	</>)
})

export default ScheduleCellsGroup
