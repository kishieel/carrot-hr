import React from 'react';
import { useSelector } from 'react-redux';
import ScheduleCell from './ScheduleCell.js'

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
const ScheduleCellsGroup = (props) => {
	console.log("Wywołano ScheduleCellGroup dla : ", props.week)

	let schedules_keys = props.week.map( date => { return `${props.employee_id}:${date}` })
	const schedules = useSelector( state => Object.entries(state.schedules).filter( ([key, schedule]) => { return schedules_keys.includes( key ) } ) )
	console.log( schedules )

	return (<>
		{ props.week.map(date => { return (
			<ScheduleCell key={ `schedule-cell-${date}-${props.employee_id}` } date={ date } employee_id={ props.employee_id } />
		) } ) }
	</>)
}

export default ScheduleCellsGroup
