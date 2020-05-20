import React from 'react'
import ScheduleRow from './ScheduleRow'
import { Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

const Schedules = ( props ) => {
	const dispatch = useDispatch()
	const employees = useSelector( state => state.employees.employeeList )

	console.log( employees )

	{ Object.keys( employees ).map( ( employeeId, i ) => {
		console.log(employeeId)
		// return (
		// 	<ScheduleRow rowNo={ i } employeeId={ employeeId } />
		// )
	} )}

	return (
		<Table className="schedules__table mb-0" striped bordered>
			<thead>
				<tr>
					<th>#</th>
					<th className="schedules__signature">Pracownik</th>
					<th>Godz.</th>
					<th>Dw.</th>
					<th></th>
				</tr>
			</thead>
			<tbody>

			</tbody>
		</Table>
	)
}

export default Schedules
