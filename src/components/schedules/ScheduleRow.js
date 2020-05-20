import React from 'react'
import ScheduleCell from './ScheduleCell'
import { useSelector } from 'react-redux'
import { selectDatesFromPeriod } from '../../selectors'

const moment = require('moment')

const ScheduleRow = React.memo( ( props ) => {
	const { rowNo, employeeId } = props
	const employee = useSelector( state => state.employees.employeeList[ employeeId ] )
	const dates = useSelector( selectDatesFromPeriod )

	return (<>
		<tr>
			<th className="text-center align-middle">{ rowNo }</th>
			<th className="text-nowrap align-middle schedules__signature">{ employee?.signature }</th>
			<th className="text-center align-middle">_</th>
			<th className="text-center align-middle">_</th>
			{ dates.map( (date) => {
				return <ScheduleCell key={ `date-${date}` } date={date} />
			})}
		</tr>
	</>)
})

export default ScheduleRow
