import React from 'react'
import ScheduleCellsGroup from './ScheduleCellsGroup'
import FreeDaysStateCell from './FreeDaysStateCell'
import WorkTimeStateCell from './WorkTimeStateCell'
import { useSelector, useDispatch } from 'react-redux'
import { selectDatesFromPeriod } from '../../selectors/settings'
import { showEmployeeSettings } from '../../actions/temporary'

const chunk = (arr, size) => Array.from(
	{ length: Math.ceil(arr.length / size) },
	(v, i) => arr.slice(i * size, i * size + size)
);

const ScheduleRow = React.memo( ( props ) => {
	const dispatch = useDispatch()
	const { rowNo, employeeId } = props
	const employee = useSelector( state => state.employees.employeeList[ employeeId ] )
	const dates = useSelector( selectDatesFromPeriod )

	return (<>
		<tr>
			<th className="text-center align-middle">{ rowNo }</th>
			<th className="text-nowrap align-middle schedules__signature" onClick={ () => dispatch( showEmployeeSettings( true, employeeId )) }>{ employee?.signature }</th>
			<WorkTimeStateCell employeeId={ employeeId } />
			<FreeDaysStateCell employeeId={ employeeId } />
			{ chunk( dates, 7 ).map( ( week ) => {
				return <ScheduleCellsGroup key={ `date-[${week.join('-')}]` } week={week} employeeId={employeeId} />
			})}
		</tr>
	</>)
})

export default ScheduleRow
