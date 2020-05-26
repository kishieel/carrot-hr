import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Table } from 'react-bootstrap';
import { chunk, calculateTimeBase, isShiftValid, isTimeFormatValid, getDayShortName, getDatesFromPeriod } from '../helpers'
import EmployeeSettings from './EmployeeSettings.js'
import ScheduleRow from './ScheduleRow.js'

const moment = require('moment')

function Schedule() {
	const [modalShow, setModalShow] = useState(false);
	const [modalEmployeeID, setModalEmployeeID] = useState(0)
	const dispatch = useDispatch();
	const { billing_period, billing_period_type } = useSelector( state => state.settings );
	const employees = useSelector( state => state.employees );

	return ( <>
		<EmployeeSettings employee={ employees[ modalEmployeeID ] } employee_id={ modalEmployeeID } modalShow={ modalShow } onHide={ () => setModalShow(false) }/>
		<Table className="carrotHR__table mb-0" striped bordered>
			<thead>
				<tr>
					<th>#</th>
					<th className="carrotHR__signature">Pracownik</th>
					<th>Godz.</th>
					<th>Dw.</th>
					{ getDatesFromPeriod( billing_period, billing_period_type ).map(date => { return (
						<th key={ `header-${date}`} className="text-nowrap text-center p-0">
							<span className="px-3">{ moment(date).format('DD-MM') }</span><hr className="m-0"/>
							<span className="px-3">{ getDayShortName( moment(date).format('ddd').toLowerCase() ) }</span>
						</th>
					)}) }
				</tr>
			</thead>
			<tbody>
				{ Object.keys(employees).map((key, i) => { return (
					<ScheduleRow key={ `schedule-row-${key}` } no={ i + 1 } employeeId={ key } onSignatureClick={ () => { setModalEmployeeID( key ); setModalShow(true) } }/>
				)})}
				<tr>
					<th className="text-center">#</th>
					<th className="text-nowrap">
						<Form.Control type="text" size="sm" placeholder="DODAJ PRACOWNIKA" onKeyDown={ (e) => { ( e.key === 'Enter' ) ? (() => { dispatch({ type: 'EMPLOYEE_CREATE', value: e.target.value }); e.target.value = ""; })() : (() => {})() } }/>
					</th>
					<th></th>
					<th></th>
					{ getDatesFromPeriod( billing_period, billing_period_type ).map(date => { return (
						<td key={ `footer-row-${date}` } className="text-center"> </td>
					)}) }
				</tr>
			</tbody>
		</Table>
	</> );
}

export default Schedule;
