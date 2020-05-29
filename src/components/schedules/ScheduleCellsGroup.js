import React from 'react'
import ScheduleCell from './ScheduleCell'
import { useSelector } from 'react-redux';
import { validWeeklySchedule } from '../../validators'

const ScheduleCellsGroup = React.memo( (props) => {
	const { employeeId, week } = props
	const validation = useSelector( validWeeklySchedule( employeeId, week ) )

	return (<>
		{ week.map( date => {
			return <ScheduleCell key={`schedule-${date}`} date={ date } employeeId={ employeeId } weekValidation={ validation }/>
		})}
	</>)
})

export default ScheduleCellsGroup
