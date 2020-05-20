import React from 'react'

const ScheduleCell = React.memo( (props) => {
	const { date } = props

	return (<td>
		{ date }
	</td>)
})

export default ScheduleCell
