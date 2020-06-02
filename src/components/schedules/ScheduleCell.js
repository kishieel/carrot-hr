import React from 'react'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { updateScheduleOnChange, updateScheduleOnBlur } from '../../actions/schedules'
import {
	SHIFT_FORMAT,
	selectDailySchedule
} from '../../selectors/schedules'

const moment = require('moment')

const ScheduleCell = React.memo( (props) => {
	const dispatch = useDispatch()
	const { employeeId, date, weekValidation } = props
	const { timeLayer, absenceLayer } = useSelector( state => state.temporary )
	const shiftList = useSelector( state => state.settings.shiftList )
	const { schedule, validation } = useSelector( selectDailySchedule( employeeId, date ) )

	let tdClassName = "text-center align-middle p-0"
	let beginClassName = "schedules__input"
	let ceaseClassName = "schedules__input"

	if ( moment( date ).format("ddd").toLowerCase() === "sun" ) {
		tdClassName += " schedules__field--sunday"
	}

	if ( schedule.format === SHIFT_FORMAT ) {
		ceaseClassName += " d-none"
	}

	let controlsView = (<>
		<Form.Control
			className={ beginClassName }
			type="text"
			size="sm"
			value={ schedule?.begin || "" }
			onChange={ (e) => dispatch( updateScheduleOnChange( employeeId, date, "begin", e.target.value.toUpperCase() ) ) }
			onBlur={ (e) => dispatch( updateScheduleOnBlur( employeeId, date, "begin", e.target.value.toUpperCase(), shiftList ) ) }/>
		<Form.Control
			className={ ceaseClassName }
			type="text"
			size="sm"
			value={ schedule?.cease || "" }
			onChange={ (e) => dispatch( updateScheduleOnChange( employeeId, date, "cease", e.target.value.toUpperCase() ) ) }/>
	</>)

	if ( timeLayer === true ) {
		controlsView = schedule?.workTime || ""

		if ( schedule.format === SHIFT_FORMAT ) {
			controlsView = schedule?.begin
		}
	}

	if ( weekValidation.status === false ) {
		validation.status = false
		validation.message += weekValidation.message
	}

	if ( validation.status === false ) {
		tdClassName += " schedules__field--warning"
	}

	return (<>
		<OverlayTrigger overlay={
			<Tooltip className={ ( validation.status === false ) ? "" : "d-none" }> { validation.message } </Tooltip>
		}>
			<td className={ tdClassName }>
				{ controlsView }
			</td>
		</OverlayTrigger>
	</>)
})

export default ScheduleCell
