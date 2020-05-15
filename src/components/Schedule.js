import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Container, Row, Col, Button, Form, Table } from 'react-bootstrap';
import { isShiftValid, isTimeFormatValid, getDayShortName, getDatesFromPeriod } from '../helpers'

const moment = require('moment')

const EmployeeModal = (props) => {
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
				<Button variant="danger" onClick={ props.onHide }> Usuń </Button>
				<Button onClick={ props.onHide }> Zamknij </Button>
			</Modal.Footer>
		</Modal>
	)
}

const ScheduleCell = React.memo((props) => {
	const dispatch = useDispatch()
	const { daily_time } = useSelector( state => state.settings ) 

	let schedule_id = `${props.employee_id}:${props.date}`
	const schedule = useSelector( state => state.schedules[ schedule_id ] ) || null

	let tdClassName = "text-center align-middle p-0"
	if ( moment( props.date ).format("ddd").toLowerCase() === "sun" ) tdClassName += " carrotHR__field--sunday"

	if ( schedule !== null ) {
		if ( schedule.preference === true ) tdClassName += " carrotHR__field--preference"
		if ( isTimeFormatValid( schedule.begin ) === true && isTimeFormatValid( schedule.cease ) === true ) {
			let beginDate = moment(`${props.date} ${schedule.begin}`)
			let ceaseDate = moment(`${props.date} ${schedule.cease}`)

			let diff = ceaseDate.diff( beginDate, 'hours' )
			if ( diff <= 0 ) diff += 24;
			// console.log( props.date, diff )

			if ( diff > daily_time ) tdClassName += " carrotHR__field--warning"
		} else {
			tdClassName += " carrotHR__field--warning"
		}
	}
	console.log( props.date, schedule )

	return (
		<td className={ tdClassName }>
			<Form.Control className="carrotHR__input" type="text" size="sm" value={ schedule?.begin || "" } onChange={ (e) => dispatch({ type: "EDIT_SCHEDULE", schedule_id: schedule_id, property: "begin", value: e.target.value}) }/>
			<Form.Control className="carrotHR__input" type="text" size="sm" value={ schedule?.cease || "" } onChange={ (e) => dispatch({ type: "EDIT_SCHEDULE", schedule_id: schedule_id, property: "cease", value: e.target.value}) }/>
		</td>
	)
});

const ScheduleRow = React.memo((props) => {
	const { billing_period, billing_period_type } = useSelector( state => state.settings );

	return (
		<tr>
			<th className="text-center">{ props.no }</th>
			<th className="text-nowrap" onClick={ props.onSignatureClick }>{ props.employee.signature }</th>
			{ getDatesFromPeriod( billing_period, billing_period_type ).map(date => { return (
				<ScheduleCell key={ `schedule-cell-${date}-${props.employee_id}` } date={ date } employee_id={ props.employee_id } />
			)}) }
		</tr>
	)
})

function Schedule() {
	const [modalShow, setModalShow] = useState(false);
	const [modalEmployeeID, setModalEmployeeID] = useState(0)
	const dispatch = useDispatch();
	const { billing_period, billing_period_type } = useSelector( state => state.settings );
	const employees = useSelector( state => state.employees );

	return ( <>
		<EmployeeModal employee={ employees[ modalEmployeeID ] } employee_id={ modalEmployeeID } modalShow={ modalShow } onHide={ () => setModalShow(false) }/>
		<Table className="carrotHR__table mb-0" striped bordered>
			<thead>
				<tr>
					<th>#</th>
					<th className="carrotHR__signature">Pracownik</th>
					{ getDatesFromPeriod( billing_period, billing_period_type ).map(date => { return (
						<th key={ `header-${date}`} className="text-nowrap text-center p-0">
							<span className="px-3">{ moment(date).format('DD-MM') }</span><hr className="m-0"/>
							<span className="px-3">{ getDayShortName( moment(date).format('ddd').toLowerCase() ) }</span>
						</th>
					)}) }
				</tr>
			</thead>
			<tbody>
				{ Object.entries(employees).map(([employee_id, employee], i) => { return (
					<ScheduleRow key={ `schedule-row-${employee_id}` } no={ i + 1 } employee={ employee } employee_id={ employee_id } onSignatureClick={ () => { setModalEmployeeID( employee_id ); setModalShow(true) } }/>
				)})}
				<tr>
					<th className="text-center">#</th>
					<th className="text-nowrap">
						<Form.Control type="text" size="sm" placeholder="DODAJ PRACOWNIKA" onKeyDown={ (e) => { ( e.key === 'Enter' ) ? (() => { dispatch({ type: 'EMPLOYEE_CREATE', value: e.target.value }); e.target.value = ""; })() : (() => {})() } }/>
					</th>
					{ getDatesFromPeriod( billing_period, billing_period_type ).map(date => { return (
						<td key={ `footer-row-${date}` } className="text-center"> </td>
					)}) }
				</tr>
			</tbody>
		</Table>
	</> );
}

export default Schedule;
