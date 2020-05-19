import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from 'react-bootstrap';
import { isShiftValid, isTimeFormatValid } from '../helpers'

const moment = require('moment')

// waliduje dzien
const ScheduleCell = React.memo((props) => {

	const dispatch = useDispatch()
	const { date, employee_id, isWeeklyBreakMet } = props

	const { daily_time, daily_break, free_days, shifts_time } = useSelector( state => state.settings )

	let schedule_id = `${employee_id}:${date}`
	const schedule = useSelector( state => state.schedules[ schedule_id ] ) || null

	let prev_date = moment(date).add(-1, 'days').format("YYYY-MM-DD");
	let prev_schedule_id = `${employee_id}:${prev_date}`
	const prev_schedule = useSelector( state => state.schedules[ prev_schedule_id ] ) || null

	let tdClassName = "text-center align-middle p-0"
	let beginClassName = "carrotHR__input"
	let ceaseClassName = "carrotHR__input"
	if ( moment( date ).format("ddd").toLowerCase() === "sun" ) tdClassName += " carrotHR__field--sunday"

	if ( schedule !== null ) {
		if ( schedule.preference === true ) tdClassName += " carrotHR__field--preference"
		if ( isTimeFormatValid( schedule.begin ) === true && isTimeFormatValid( schedule.cease ) === true ) {
			let beginDate = moment(`${date} ${schedule.begin}`)
			let ceaseDate = moment(`${date} ${schedule.cease}`)

			let diff = ceaseDate.diff( beginDate, 'hours', true )
			if ( diff <= 0 ) diff += 24;

			if ( diff > moment.duration(daily_time).asHours() ) {
				tdClassName += " carrotHR__field--warning"
				console.warn(`${employee_id}:${date} -> Przekroczono maksymalny czas pracy.`)
			}

			if ( prev_schedule !== null ) {
				let preventScheduleBegin = moment( `${prev_date} ${prev_schedule.begin}` )
				let preventScheduleCease = moment( `${prev_date} ${prev_schedule.cease}` )
				if ( preventScheduleCease.diff( preventScheduleBegin ) < 0 ) {
					preventScheduleCease.add(1, 'days')
				}

				let daysDiff = beginDate.diff( preventScheduleCease, 'hours', true )
				if ( daysDiff < moment.duration(daily_break).asHours() ) {
					tdClassName += " carrotHR__field--warning"
					console.warn(`${employee_id}:${date} -> Złamano dobę pracowniczą.`)
				}
			}
		} else if ( isShiftValid( schedule.begin, free_days ) === true ) {
			if ( schedule.begin === "WS" ) tdClassName += " carrotHR__field--holiday"
			ceaseClassName += " d-none"
		} else {
			tdClassName += " carrotHR__field--warning"
		}
	}

	if ( isWeeklyBreakMet === false ) tdClassName += " carrotHR__field--warning"

	return (
		<td className={ tdClassName }>
			<Form.Control className={ beginClassName } type="text" size="sm" value={ schedule?.begin || "" } onChange={ (e) => dispatch({ type: "EDIT_SCHEDULE", schedule_id: schedule_id, property: "begin", value: e.target.value}) } onBlur={ (e) => dispatch({ type: "PROCESS_SCHEDULE", settings: { shifts_time}, schedule_id: schedule_id, value: e.target.value}) }/>
			<Form.Control className={ ceaseClassName } type="text" size="sm" value={ schedule?.cease || "" } onChange={ (e) => dispatch({ type: "EDIT_SCHEDULE", schedule_id: schedule_id, property: "cease", value: e.target.value}) }/>
		</td>
	)
})

export default ScheduleCell
