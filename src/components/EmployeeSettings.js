import React from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Container, Row, Col, Button, Form } from 'react-bootstrap';

const EmployeeSettings = (props) => {
	const dispatch = useDispatch();

	return (
		<Modal show={ props.modalShow } onHide={ props.onHide } size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					Panel - { props.employee?.signature }
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<Row className="show-grid align-items-center mb-2">
						<Col sm={6} lg={8}> Dane personalne: </Col>
						<Col sm={6} lg={4}>
							<Form.Control type="text" value={ props.employee?.signature } onChange={ (e) => dispatch({ type: 'EMPLOYEE_UPDATE', id: props.employee_id, field: 'signature', value: e.target.value })}/>
						</Col>
					</Row>
					<Row className="show-grid align-items-center mb-2">
						<Col sm={6} lg={8}> Wymiar czasu pracy: </Col>
						<Col sm={6} lg={4}>
							<Form.Control as="select" value={ props.employee?.time_contract } onChange={ (e) => dispatch({ type: 'EMPLOYEE_UPDATE', id: props.employee_id, field: 'time_contract', value: e.target.value })} custom>
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
							<Form.Control type="text" value={ props.employee?.role } onChange={ (e) => dispatch({ type: 'EMPLOYEE_UPDATE', id: props.employee_id, field: 'role', value: e.target.value.toUpperCase() })}/>
						</Col>
					</Row>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={ () => { props.onHide(); dispatch({type: "EMPLOYEE_REMOVE", employee_id: props.employee_id}); } }> Usuń </Button>
				<Button onClick={ props.onHide }> Zamknij </Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EmployeeSettings
