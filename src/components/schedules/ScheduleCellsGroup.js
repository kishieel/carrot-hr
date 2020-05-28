import React from 'react'
import ScheduleCell from './ScheduleCell'
import { useSelector } from 'react-redux';
import { selectWeekSchedulesValidation } from '../../selectors/schedules'

const ScheduleCellsGroup = React.memo( (props) => {
	const { employeeId, week } = props
	const validation = useSelector( selectWeekSchedulesValidation( employeeId, week ) )
	console.log( validation )

	return (<>
		{ week.map( date => {
			return <ScheduleCell key={`schedule-${date}`} date={date} employeeId={employeeId} />
		})}
	</>)
})

export default ScheduleCellsGroup
