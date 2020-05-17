import React from 'react';
import { useSelector } from 'react-redux';
import ScheduleCell from './ScheduleCell.js'
import { isTimeFormatValid } from '../helpers'
import { createSelector } from 'reselect'

const moment = require('moment')
const abc = createSelector( (schedules, employeeId, week) => {
	let schedulesId = week.map( date => { return `${employeeId}:${date}` })
	return Object.entries(schedules).filter( ([key, schedule]) => {
		return schedulesId.includes(key)
	})
})
// const abc = ( schedules, employeeId, week ) => {
// 	return Object.entries(schedules).filter( ([key, schedule]) => { return true })
// }

const ScheduleCellsGroup = React.memo((props) => {
	const { week, employee_id } = props
	const { weekly_break } = useSelector ( state => state.settings )

	const week_schedules = {}
	week_schedules[ `${employee_id}:${week[0]}` ] = useSelector( state => state.schedules[ `${employee_id}:${week[0]}` ] ) || null
	week_schedules[ `${employee_id}:${week[1]}` ] = useSelector( state => state.schedules[ `${employee_id}:${week[1]}` ] ) || null
	week_schedules[ `${employee_id}:${week[2]}` ] = useSelector( state => state.schedules[ `${employee_id}:${week[2]}` ] ) || null
	week_schedules[ `${employee_id}:${week[3]}` ] = useSelector( state => state.schedules[ `${employee_id}:${week[3]}` ] ) || null
	week_schedules[ `${employee_id}:${week[4]}` ] = useSelector( state => state.schedules[ `${employee_id}:${week[4]}` ] ) || null
	week_schedules[ `${employee_id}:${week[5]}` ] = useSelector( state => state.schedules[ `${employee_id}:${week[5]}` ] ) || null
	week_schedules[ `${employee_id}:${week[6]}` ] = useSelector( state => state.schedules[ `${employee_id}:${week[6]}` ] ) || null

	let preventSchedule = null
	let currentSchedule = null
	let preventScheduleCease = moment( `${week[0]} 0:00`)
	let currentScheduleBegin = null
	let isWeeklyBreakMet = false
	let preventDate = week[0]
	for ( const date of week ) {
		if ( currentSchedule !== null ) {
			preventSchedule = currentSchedule
			if ( preventSchedule !== null && isTimeFormatValid( preventSchedule.begin ) === true && isTimeFormatValid( preventSchedule.cease ) === true ) {
				let preventScheduleBegin = moment( `${preventDate} ${preventSchedule.begin}` )
				preventScheduleCease = moment( `${preventDate} ${preventSchedule.cease}` )
				if ( preventScheduleCease.diff( preventScheduleBegin ) < 0 ) {
					preventScheduleCease.add(1, 'days')
				}
			}
		}
		currentSchedule = week_schedules[ `${employee_id}:${date}`] || null
		preventDate = date

		if ( date !== week[0] ) {
			if ( currentSchedule !== null && isTimeFormatValid( currentSchedule.begin ) === true && isTimeFormatValid( currentSchedule.cease ) === true ) {
				currentScheduleBegin = moment( `${date} ${currentSchedule.begin}` )
			} else {
				currentScheduleBegin = moment( `${date} 24:00` )
			}

			let diff = currentScheduleBegin.diff( preventScheduleCease, 'hours', true )
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
