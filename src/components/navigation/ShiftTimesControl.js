import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Table, Form, Row, Col } from 'react-bootstrap'
import { updateSettings, updateShiftTimes } from '../../actions/settings'
import { selectShiftTimes } from '../../selectors/settings'

const ShiftTimesControl = ( ) => {
	const dispatch = useDispatch()
	const shiftsCount = useSelector( state => state.settings.shiftsCount )
	const shiftTimes = useSelector( selectShiftTimes )


	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={7} lg={8}>
				Ilość zmian:
			</Col>
			<Col sm={5} lg={4}>
				<Form.Control as="select" value={ shiftsCount } onChange={ (e) => dispatch( updateSettings( "shiftsCount", parseInt( e.target.value ) ) ) } custom>
					<option value={ 1 }>1</option>
					<option value={ 2 }>2</option>
					<option value={ 3 }>3</option>
				</Form.Control>
			</Col>
		</Row>
		<Row className="show-grid align-items-center mb-2">
			<Col xs={12}>
				<Table bordered>
					<thead>
						<tr>
							<th>Zmiana:</th>
							<th className="text-center text-truncate w-15">Rozpoczęcie</th>
							<th className="text-center text-truncate w-15">Zakończenie</th>
							<th className="text-center text-truncate w-15">Kierownik</th>
						</tr>
					</thead>
					<tbody>
						{ Object.entries( shiftTimes ).map( ([ shiftNumber, shiftTime ]) => {
							console.log( shiftTime)

							return (
								<tr key={ `shift-time-${ shiftNumber }` } >
									<td>Zmiana { "I".repeat( parseInt( shiftNumber ) ) }</td>
									<td className="text-center w-10">
										<Form.Control
											className="text-center"
											type="text"
											size="sm"
											value={ shiftTime.begin }
											onChange={ (e) => dispatch( updateShiftTimes( shiftNumber, "begin", e.target.value ) )} />
									</td>
									<td className="text-center w-10">
										<Form.Control
											className="text-center"
											type="text"
											size="sm"
											value={ shiftTime.cease }
											onChange={ (e) => dispatch( updateShiftTimes( shiftNumber, "cease", e.target.value ) )} />
									</td>
									<td className="text-center w-10">
										<Form.Check
											className="text-center"
											type="checkbox"
											id={ `require-manager-${ shiftNumber }` }
											label="Wymagany"
											size="sm"
											checked={ shiftTime.requireManager }
											onChange={ (e) => dispatch( updateShiftTimes( shiftNumber, "requireManager", e.target.checked ) )}
											custom/>
									</td>
								</tr>
							)
						}) }
					</tbody>
				</Table>
			</Col>
		</Row>
	</>)
}

export default ShiftTimesControl
