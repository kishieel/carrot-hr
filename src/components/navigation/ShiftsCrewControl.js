import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Table, Form, Row, Col } from 'react-bootstrap'
import { updateShiftCrew } from '../../actions/settings'

const moment = require('moment')

const ShiftsCrewControl = ( ) => {
	const dispatch = useDispatch()
	const shifts = useSelector( state => state.settings.shiftList )

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col> Preferowana załoga pracownicza: </Col>
		</Row>
		<Row className="show-grid align-items-center mb-2">
			<Col xs={12}>
				<div className="overflow-auto">
					<Table className="mb-0" bordered>
						<thead>
							<tr>
								<th>Nazwa zmiany</th>
								{ [ ...Array(7).keys() ].map( dayNumber => {
									return (
										<th className="text-center">{ moment().weekday( dayNumber + 1 ).locale('pl').format("dd").toUpperCase() }</th>
									)
								}) }
							</tr>
						</thead>
						<tbody>
							{ Object.entries( shifts ).map( ([ shiftId, shift ]) => {
								return (
									<tr key={ `shift-${ shiftId }` } >
										<td>{ shift.name }</td>
										{ [ ...Array(7).keys() ].map( dayNumber => {
											let dayName = moment().weekday( dayNumber + 1 ).format("ddd").toLowerCase()

											return (
												<td className="text-center w-10">
													<Form.Control
														className="text-center px-1"
														type="text"
														size="sm"
														value={ shift.crew[ dayName ] }
														onChange={ (e) => dispatch( updateShiftCrew( shiftId, dayName, e.target.value ) )} />
												</td>
											)
										}) }
									</tr>
								)
							}) }
						</tbody>
					</Table>
				</div>
			</Col>
		</Row>
	</>)
}

// 		<Row className="show-grid align-items-center mb-2">
// 			<Col xs={12}>
// 				<Table bordered>
// 					<thead>
// 						<tr>
// 							<th>Zmiana:</th>
// 							{ [ ...Array( shiftsCount ).keys() ].map( shiftNumber => {
// 								return <th key={ shiftNumber } className="text-center w-15">{ "I".repeat( shiftNumber + 1 ) }</th>
// 							}) }
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{ [ ...Array(7).keys() ].map( dayNumber => {
// 							let m = moment().weekday( dayNumber + 1 )
// 							let dayName = m.format("ddd").toLowerCase()
// 							let dayNamePL =  m.locale('pl').format("dddd")
//
// 							return (
// 								<tr key={ dayNumber } >
// 									<td>{ dayNamePL.charAt(0).toUpperCase() + dayNamePL.slice(1) }</td>
// 									{ [ ...Array( shiftsCount ).keys() ].map( shiftNumber => {
// 										return (
// 											<td key={ shiftNumber } className="text-center w-15">
// 												<Form.Control className="text-center" type="text" size="sm" value={ shiftCrew[ dayName ][ shiftNumber + 1 ] } onChange={ (e) => dispatch( updateShiftCrew( dayName, shiftNumber + 1, parseInt( e.target.value ) ) )} />
// 											</td>
// 										)
// 									}) }
// 								</tr>
// 							)
// 						}) }
// 					</tbody>
// 				</Table>
// 			</Col>
		// </Row>
//
// // { ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(key => {
// // 	if ( ( free_days[key] === null ) || ( free_days[key] !== null && free_days[key].permanent === false ) ) {
// // 		return (
// // 			<tr key={ `shifts-crew-${key}` } >
// // 				<td>{ getDayName( key ) }</td>
// // 				<td className="text-center w-15">
// // 					<Form.Control className="text-center" type="text" size="sm" value={ shifts_crew[key].shift_1 } onChange={ (e) => dispatch({ type: "SHIFTS_CREW", key: key, shift: "shift_1", value: e.target.value })} />
// // 				</td>
// // 				<td className="text-center w-15">
// // 					<Form.Control className="text-center" type="text" size="sm" value={ shifts_crew[key].shift_2 } onChange={ (e) => dispatch({ type: "SHIFTS_CREW", key: key, shift: "shift_2", value: e.target.value })} />
// // 				</td>
// // 				<td className="text-center w-15">
// // 					<Form.Control className="text-center" type="text" size="sm" value={ shifts_crew[key].shift_3 } onChange={ (e) => dispatch({ type: "SHIFTS_CREW", key: key, shift: "shift_3", value: e.target.value })} />
// // 				</td>
// // 			</tr>
// // 		)
// // 	} else {
// // 		return false;
// // 	}
// // }) }
//
export default ShiftsCrewControl
