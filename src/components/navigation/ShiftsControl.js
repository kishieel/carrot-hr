import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Table, Form, Row, Col } from 'react-bootstrap'
import { createShift, updateShift, removeShift } from '../../actions/settings'

const ShiftsControl = ( ) => {
	const dispatch = useDispatch()
	const shifts = useSelector( state => state.settings.shiftList )

	const onKeyDownHandler = (e) => {
		if ( e.key.toLowerCase() === "enter" ) {
			dispatch( createShift( e.target.value ) )
			e.target.value = ""
		}
	}

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col> Szablon zmian: </Col>
		</Row>
		<Row className="show-grid align-items-center mb-2">
			<Col xs={12}>
				<div className="overflow-auto">
					<Table className="mb-0" bordered>
						<thead>
							<tr>
								<th>Nazwa zmiany</th>
								<th className="text-center text-truncate w-10">Indeks</th>
								<th className="text-center text-truncate w-15">Rozpoczęcie</th>
								<th className="text-center text-truncate w-15">Zakończenie</th>
								<th className="text-center text-truncate w-15">Kierownik</th>
								<th className="text-center"></th>
							</tr>
						</thead>
						<tbody>
							{ Object.entries( shifts ).map( ([ shiftId, shift ]) => {
								return (
									<tr key={ `shift-${ shiftId }` } >
										<td>
											<Form.Control
												type="text"
												size="sm"
												value={ shift.name }
												onChange={ (e) => dispatch( updateShift( shiftId, "name", e.target.value ) )} />
										</td>
										<td className="text-center w-10">
											<Form.Control
												className="text-center"
												type="text"
												size="sm"
												value={ shift.index }
												onChange={ (e) => dispatch( updateShift( shiftId, "index", e.target.value.toUpperCase() ) )} />
										</td>
										<td className="text-center w-15">
											<Form.Control
												className="text-center"
												type="text"
												size="sm"
												value={ shift.begin }
												onChange={ (e) => dispatch( updateShift( shiftId, "begin", e.target.value ) )} />
										</td>
										<td className="text-center w-15">
											<Form.Control
												className="text-center"
												type="text"
												size="sm"
												value={ shift.cease }
												onChange={ (e) => dispatch( updateShift( shiftId, "cease", e.target.value ) )} />
										</td>
										<td className="text-center w-15">
											<Form.Check
												className="text-center"
												type="checkbox"
												id={ `require-manager-${ shiftId }` }
												label="Wymagany"
												size="sm"
												checked={ shift.requireManager }
												onChange={ (e) => dispatch( updateShift( shiftId, "requireManager", e.target.checked ) )}
												custom/>
										</td>
										<td>
											<Button
												variant="danger"
												size="sm"
												onClick={ () => dispatch( removeShift( shiftId ) ) }>
												&#10008;
											</Button>
										</td>
									</tr>
								)
							}) }
							<tr key={ `shift-new` } >
								<td>
									<Form.Control
										type="text"
										size="sm"
										placeholder="DODAJ ZMIANĘ"
										onKeyDown={ (e) => onKeyDownHandler(e) } />
								</td>
								<td className="text-center w-10"></td>
								<td className="text-center w-15"></td>
								<td className="text-center w-15"></td>
								<td className="text-center w-15"></td>
								<td></td>
							</tr>
						</tbody>
					</Table>
				</div>
			</Col>
		</Row>
	</>)
}

export default ShiftsControl
