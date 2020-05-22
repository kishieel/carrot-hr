import React from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { updateEmployee } from '../../actions/employees'

const Signature = ( props ) => {
	const { employeeId } = props
	const dispatch = useDispatch()
	const signature = useSelector( state => state.employees.employeeList[employeeId]?.signature )

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={6} lg={8}> Dane personalne: </Col>
			<Col sm={6} lg={4}>
				<Form.Control type="text" value={ signature } onChange={ (e) => dispatch( updateEmployee( employeeId, "signature", e.target.value ) ) }/>
			</Col>
		</Row>
	</>)
}

export default Signature
