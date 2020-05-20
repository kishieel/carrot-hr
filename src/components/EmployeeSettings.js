import React, { useState } from 'react'
import { Modal, Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { showEmployeeSettings } from '../actions/temporary'

const EmployeeSettings = (props) => {
	const dispatch = useDispatch()
	const { show, employeeId  } = useSelector( state => state.temporary.employeeSettings)
	console.log(show, employeeId)
	const employee = useSelector( state => state.employees.employeeList[ employeeId ] )

	return (
		<Modal show={ show } onHide={ () => dispatch( showEmployeeSettings( false, 0 ) ) } size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					Panel - { employee?.signature }
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<Row className="show-grid align-items-center mb-2">
						<Col sm={6} lg={8}> Dane personalne: </Col>
						<Col sm={6} lg={4}>
							<Form.Control type="text" value={ employee?.signature } onChange={ (e) => {} }/>
						</Col>
					</Row>
					<Row className="show-grid align-items-center mb-2">
						<Col sm={6} lg={8}> Wymiar czasu pracy: </Col>
						<Col sm={6} lg={4}>
							<Form.Control as="select" value={ employee?.time_contract } onChange={ (e) => {} } custom>
								<option value={1}>Pełny etat</option>
								<option value={0.75}>3/4 etatu</option>
								<option value={0.5}>Pół etatu</option>
								<option value={0.25}>Ćwierć etatu</option>
							</Form.Control>
						</Col>
					</Row>
					<Row className="show-grid align-items-center mb-2">
						<Col sm={6} lg={8}> Stanowisko: </Col>
						<Col sm={6} lg={4}>
							<Form.Control type="text" value={ employee?.role } onChange={ (e) => {} }/>
						</Col>
					</Row>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={ () => {} }> Usuń </Button>
				<Button onClick={ () => dispatch( showEmployeeSettings( false, 0 ) ) }> Zamknij </Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EmployeeSettings
