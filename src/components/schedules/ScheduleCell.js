import React from 'react'
import { Form } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux';
import { updateSchedule } from '../../actions/schedules'

const ScheduleCell = React.memo( (props) => {
	const dispatch = useDispatch()
	const { date, employeeId } = props
	const schedule = useSelector( state => state.schedules[ employeeId ]?.[ date ] ) || null

	let tdClassName = "text-center align-middle p-0"
	let beginClassName = "schedules__input"
	let ceaseClassName = "schedules__input"

	return (<td className={ tdClassName }>
		<Form.Control className={ beginClassName } type="text" size="sm" value={ schedule?.begin } onChange={ (e) => dispatch( updateSchedule( employeeId, date, "begin", e.target.value) ) }/>
		<Form.Control className={ ceaseClassName } type="text" size="sm" value={ schedule?.cease } onChange={ (e) => dispatch( updateSchedule( employeeId, date, "cease", e.target.value) ) }/>
	</td>)
})

export default ScheduleCell
