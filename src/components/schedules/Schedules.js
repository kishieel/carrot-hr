import React from 'react'
import ScheduleRow from './ScheduleRow'
import SchedulesColHeader from './SchedulesColHeader'
import { Table, Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { createEmployee } from '../../actions/employees'
import { selectDatesFromPeriod } from '../../selectors/settings'

const moment = require('moment')

const Schedules = ( props ) => {
	const dispatch = useDispatch()
	const employees = useSelector( state => state.employees.employeeList )
	const dates = useSelector( selectDatesFromPeriod )

	const onKeyDownHandler = (e) => {
		if ( e.key.toLowerCase() === "enter" ) {
			dispatch( createEmployee( e.target.value ) )
			e.target.value = ""
		}
	}

	return (<>
		<Table className="schedules__table mb-0" striped bordered>
			<thead>
				<tr>
					<th>#</th>
					<th className="schedules__signature">Pracownik</th>
					<th>Godz.</th>
					<th>Dw.</th>
					{ dates.map( (date) => <SchedulesColHeader date={ date } /> )}
				</tr>
			</thead>
			<tbody>
				{ Object.keys( employees ).map( ( employeeId, i ) => {
					return (
						<ScheduleRow key={ `employee-${employeeId}` } rowNo={ i + 1 } employeeId={ employeeId }/>
					)
				} )}
				<tr>
					<th className="text-center">#</th>
					<th className="text-nowrap">
						<Form.Control type="text" size="sm" placeholder="DODAJ PRACOWNIKA" onKeyDown={ (e) => onKeyDownHandler(e) }/>
					</th>
					<th></th>
					<th></th>
					{ dates.map( (date) => {
						let m = moment(date)
						return (<th key={ m.format('DD-MM') }></th>)
					})}
				</tr>
			</tbody>
		</Table>
	</>)
}

export default Schedules
