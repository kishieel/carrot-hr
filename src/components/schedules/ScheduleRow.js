import React from 'react'
import ScheduleCell from './ScheduleCell'
import { useSelector, useDispatch } from 'react-redux'
import { selectDatesFromPeriod } from '../../selectors'
import { showEmployeeSettings } from '../../actions/temporary'


// const moment = require('moment')

const ScheduleRow = React.memo( ( props ) => {
	const dispatch = useDispatch()
	const { rowNo, employeeId, onSignatureClick } = props
	const employee = useSelector( state => state.employees.employeeList[ employeeId ] )
	const dates = useSelector( selectDatesFromPeriod )

	return (<>
		<tr>
			<th className="text-center align-middle">{ rowNo }</th>
			<th className="text-nowrap align-middle schedules__signature" onClick={ () => dispatch( showEmployeeSettings( true, employeeId )) }>{ employee?.signature }</th>
			<th className="text-center align-middle">_</th>
			<th className="text-center align-middle">_</th>
			{ dates.map( (date) => {
				return <ScheduleCell key={ `date-${date}` } date={date} employeeId={employeeId} />
			})}
		</tr>
	</>)
})

export default ScheduleRow
