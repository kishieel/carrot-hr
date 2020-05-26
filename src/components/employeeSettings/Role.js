import React from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { updateEmployee } from '../../actions/employees'

const Role = ( props ) => {
	const { employeeId } = props
	const dispatch = useDispatch()
	const role = useSelector( state => state.employees.employeeList[employeeId]?.role )

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={6} lg={8}> Stanowisko: </Col>
			<Col sm={6} lg={4}>
				<Form.Control as="select" value={ role } onChange={ (e) => dispatch( updateEmployee( employeeId, "role", e.target.value ) ) } custom>
					<option value={ "PRACOWNIK" }> PRACOWNIK </option>
					<option value={ "KIEROWNIK" }> KIEROWNIK </option>
				</Form.Control>
			</Col>
		</Row>
	</>)
}

export default Role
