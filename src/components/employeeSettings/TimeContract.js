import React from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { updateEmployee } from '../../actions/employees'

const TimeContract = ( props ) => {
	const { employeeId } = props
	const dispatch = useDispatch()
	const timeContract = useSelector( state => state.employees.employeeList[employeeId]?.timeContract )

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={6} lg={8}> Wymiar czasu pracy: </Col>
			<Col sm={6} lg={4}>
				<Form.Control as="select" value={ timeContract } onChange={ (e) => dispatch( updateEmployee( employeeId, "timeContract", parseFloat( e.target.value ) ) ) } custom>
					<option value={1}>Pełny etat</option>
					<option value={0.75}>3/4 etatu</option>
					<option value={0.5}>Pół etatu</option>
					<option value={0.25}>Ćwierć etatu</option>
				</Form.Control>
			</Col>
		</Row>
	</>)
}

export default TimeContract
