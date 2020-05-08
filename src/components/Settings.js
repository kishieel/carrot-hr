import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Container, Row, Col, Form, Table } from 'react-bootstrap';
import { DAYS, getDayName } from '../helpers'

function Settings() {
	const [modalShow, setModalShow] = useState(false);
	const dispatch = useDispatch();
	const { daily_time, daily_break, weekly_break, free_days, shifts_crew } = useSelector( state => state.settings );

	return (<>
		<Button className="mr-4" variant="outline-warning" onClick={ () => setModalShow(true) } ><b> Ustawienia </b></Button>
		<Modal show={ modalShow } onHide={ () => setModalShow(false) } size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					Panel Carrot<b>HR</b>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<Row className="show-grid align-items-center mb-2">
						<Col sm={9} lg={10}>
			  				Maksymalny dzienny czas pracy:
						</Col>
						<Col sm={3} lg={2}>
			  				<Form.Control className="text-center" type="text" placeholder="0:00" value={ daily_time } onChange={ (e) => dispatch({ type: 'DAILY_TIME', value: e.target.value })}/>
						</Col>
					</Row>
					<Row className="show-grid align-items-center mb-2">
						<Col sm={9} lg={10}>
							Minimalna przerwa między zmianami:
						</Col>
						<Col sm={3} lg={2}>
							<Form.Control className="text-center" type="text" placeholder="0:00" value={ daily_break } onChange={ (e) => dispatch({ type: 'DAILY_BREAK', value: e.target.value })}/>
						</Col>
					</Row>
					<Row className="show-grid align-items-center mb-2">
						<Col sm={9} lg={10}>
							Minimalna tygodniowa przerwa:
						</Col>
						<Col sm={3} lg={2}>
							<Form.Control className="text-center" type="text" placeholder="0:00" value={ weekly_break } onChange={ (e) => dispatch({ type: 'WEEKLY_BREAK', value: e.target.value }) }/>
						</Col>
					</Row>
					<hr/>
					<Row className="show-grid align-items-center mb-3">
						<Col xs={12} className="mb-1"> Dni wolne: </Col>
						{ DAYS.map(key => { return (
							<Col xs={6} md={4} lg={3}>
								<Form.Check className="pt-1" type="checkbox" id={`checkbox-${key}`} label={`${ getDayName( key ) }`} onChange={ (e) => dispatch({ type: 'FREE_DAYS', key: key, value: e.target.checked }) } checked={ ( free_days[key] !== null ) ? true : false } custom />
							</Col>
						) }) }
					</Row>
					{ Object.entries(free_days).map(([key, value]) => {
						if ( value !== null ) {
							return (
								<Row className="show-grid align-items-center mb-2">
									<Col >
										{ getDayName( key ) }
									</Col>
									<Col xs={3} lg={2}>
										<Form.Control className="text-center" type="text" size="sm" value={ value.index } onChange={ (e) => dispatch({ type: 'FREE_DAYS_INDEX', key: key, value: e.target.value }) }/>
									</Col>
									<Col xs={"auto"}>
										<Form.Check type="checkbox" id={`checkbox-${key}-permanent`} label="Stałe" onChange={ (e) => dispatch({ type: 'FREE_DAYS_PERMANENT', key: key, value: e.target.checked }) } checked={ value.permanent} custom />
									</Col>
									<Col xs={12}/>
								</Row>
							)
						}
					})}
					<hr/>
					<Row className="show-grid align-items-center mb-2">
						<Col> Minimalna załoga pracownicza: </Col>
					</Row>
					<Row className="show-grid align-items-center mb-2">
						<Col xs={12}>
							<Table bordered>
								<thead>
									<tr>
										<th>Zmiana:</th>
										<th className="text-center w-15">I</th>
										<th className="text-center w-15">II</th>
										<th className="text-center w-15">III</th>
									</tr>
								</thead>
								<tbody>
									{ ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(key => {
										if ( ( free_days[key] === null ) || ( free_days[key] !== null && free_days[key].permanent === false ) ) {
											return (
												<tr>
													<td>{ getDayName( key ) }</td>
													<td className="text-center w-15">
														<Form.Control className="text-center" type="text" size="sm" value={ shifts_crew[key].shift_1 } onChange={ (e) => dispatch({ type: "SHIFTS_CREW", key: key, shift: "shift_1", value: e.target.value })} />
													</td>
													<td className="text-center w-15">
														<Form.Control className="text-center" type="text" size="sm" value={ shifts_crew[key].shift_2 } onChange={ (e) => dispatch({ type: "SHIFTS_CREW", key: key, shift: "shift_2", value: e.target.value })} />
													</td>
													<td className="text-center w-15">
														<Form.Control className="text-center" type="text" size="sm" value={ shifts_crew[key].shift_3 } onChange={ (e) => dispatch({ type: "SHIFTS_CREW", key: key, shift: "shift_3", value: e.target.value })} />
													</td>
												</tr>
											)
										}
									}) }
								</tbody>
							</Table>
						</Col>
					</Row>
					<hr/>
					<Row className="show-grid align-items-center mb-3">
						<Col xs={12} className="mb-1"> Dni ustawowo wolne: </Col>
					</Row>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={ () => setModalShow(false) }> Zamknij </Button>
			</Modal.Footer>
		</Modal>
	</>)
}

export default Settings;
