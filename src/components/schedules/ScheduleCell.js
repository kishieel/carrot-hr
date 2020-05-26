import React from 'react'
import { Form, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { updateSchedule } from '../../actions/schedules'
import { selectParsedSchedule, TIME_FORMAT, INVALID_FORMAT, SHIFT_FORMAT } from '../../selectors/schedules'

const ScheduleCell = React.memo( (props) => {
	const dispatch = useDispatch()
	const { date, employeeId } = props
	const schedule = useSelector( state => state.schedules[ employeeId ]?.[ date ] ) || null
	const parsedSchedule = useSelector( selectParsedSchedule( employeeId, date ) )

	let tdClassName = "text-center align-middle p-0"
	let beginClassName = "schedules__input"
	let ceaseClassName = "schedules__input"

	let isOverlayed = false
	let tooltipMessage = ""

	if ( parsedSchedule.format === TIME_FORMAT ) {
		if ( parsedSchedule.isMaxWorkTimeValid === false ) {
			tdClassName += " schedules__field--danger"

			isOverlayed = true
			tooltipMessage = "Przekroczony maksymalny dzienne czas pracy."
		} else if ( parsedSchedule.isMinDailyBreak === false ) {
			tdClassName += " schedules__field--danger"

			isOverlayed = true
			tooltipMessage = "Złamano minimalną przerwę."
		}
	} else if ( parsedSchedule.format === SHIFT_FORMAT ) {
		ceaseClassName += " d-none"
	} else if ( parsedSchedule.format === INVALID_FORMAT ) {
		tdClassName += " schedules__field--warning"

		isOverlayed = true
		tooltipMessage = "Nieprawidłowy format wpisu."
	}

	return (<>
		<OverlayTrigger overlay={ <Tooltip className={ ( isOverlayed === true ) ? "" : "d-none" }> { tooltipMessage } </Tooltip> }>
			<td className={ tdClassName }>
				<Form.Control className={ beginClassName } type="text" size="sm" value={ schedule?.begin } onChange={ (e) => dispatch( updateSchedule( employeeId, date, "begin", e.target.value.toUpperCase() ) ) }/>
				<Form.Control className={ ceaseClassName } type="text" size="sm" value={ schedule?.cease } onChange={ (e) => dispatch( updateSchedule( employeeId, date, "cease", e.target.value.toUpperCase() ) ) }/>
			</td>
		</OverlayTrigger>
	</>)
})

export default ScheduleCell
