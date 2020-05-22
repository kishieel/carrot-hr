import React from 'react'
import ScheduleCell from './ScheduleCell'
import { useSelector, useDispatch } from 'react-redux'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { selectDatesFromPeriod, selectWorkHours, selectFreeDays } from '../../selectors/settings'
import { showEmployeeSettings } from '../../actions/temporary'

const WorkHoursCell = ( props ) => {
	const { employeeId, dates } = props
	const timeContract = useSelector( state => state.employees.employeeList[ employeeId ].timeContract )
	const workHours = useSelector( state => selectWorkHours( state, dates ) )

	let time = ( workHours * timeContract ) - 0

	let validation = { valid: true, message: "" }
	if ( time < 0 ) {
		validation.valid = false
		validation.message = "Przekroczono dostępny czas pracy."
	} else if ( time > 0 ) {
		validation.valid = false
		validation.message = "Nie wykorzystano dostępnego czasu pracy."
	}


	if ( validation.valid === false ) {
		return (<>
			<OverlayTrigger overlay={
				<Tooltip> { validation.message } </Tooltip>
			}>
				<th className="text-center align-middle schedules__field--warning">{ time }</th>
			</OverlayTrigger>
		</>)
	}

	return (<>
		<th className="text-center align-middle">{ time }</th>
	</>)
}

const FreeDaysCell = ( props ) => {
	const { employeeId, dates } = props
	const freeDaysAmount = useSelector( state => selectFreeDays( state, dates ) )

	let validation = { valid: true, message: "" }

	Object.entries( freeDaysAmount ).map( ([ dayName, freeDay ]) => {
		if ( freeDay.left !== 0 ) {
			validation.valid = false
			if ( validation.message === "" ) {
				validation.message = "Zaległe dni wolne:"
			}
			validation.message += `\n${freeDay.index} : ${freeDay.left}`
		}
	} )

	if ( validation.valid === false ) {
		return (<>
			<OverlayTrigger overlay={
				<Tooltip style={{ whiteSpace: "pre-wrap" }}> { validation.message } </Tooltip>
			}>
				<th className="text-center align-middle schedules__field--warning">&#10008;</th>
			</OverlayTrigger>
		</>)
	}

	return (<>
		<th className="text-center align-middle">&#10004;</th>
	</>)
}

const ScheduleRow = ( props ) => {
	const dispatch = useDispatch()
	const { rowNo, employeeId } = props
	const employee = useSelector( state => state.employees.employeeList[ employeeId ] )
	const dates = useSelector( selectDatesFromPeriod )

	return (<>
		<tr>
			<th className="text-center align-middle">{ rowNo }</th>
			<th className="text-nowrap align-middle schedules__signature" onClick={ () => dispatch( showEmployeeSettings( true, employeeId )) }>{ employee?.signature }</th>
			<WorkHoursCell employeeId={ employeeId } dates={ dates } />
			<FreeDaysCell employeeId={ employeeId } dates={ dates } />
			{ dates.map( (date) => {
				return <ScheduleCell key={ `date-${date}` } date={date} employeeId={employeeId} />
			})}
		</tr>
	</>)
}

export default ScheduleRow
