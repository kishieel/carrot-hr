import React from 'react'
import { Form } from 'react-bootstrap'

const ScheduleCell = React.memo( (props) => {
	// const { date, employeeId } = props

	let tdClassName = "text-center align-middle p-0"
	let beginClassName = "schedules__input"
	let ceaseClassName = "schedules__input"

	return (<td className={ tdClassName }>
		<Form.Control className={ beginClassName } type="text" size="sm" />
		<Form.Control className={ ceaseClassName } type="text" size="sm" />
	</td>)
})

export default ScheduleCell
