import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap'
import { setFreeDays, updateFreeDays } from '../../actions/settings'

const moment = require('moment')

const DailyBreakControl = ( ) => {
	const dispatch = useDispatch()
	const freeDays = useSelector( state => state.settings.freeDays )

	return (<>
		<Row className="show-grid align-items-center mb-3">
			<Col xs={12} className="mb-1"> Dni wolne: </Col>
			{ [ ...Array(7).keys() ].map( dayNumber => {
				let m = moment().weekday( dayNumber + 1 )
				let dayName = m.format("ddd").toLowerCase()
				let dayNamePL = m.locale('pl').format("dddd")

				return (
					<Col key={ `free-days-checkbox-${ dayName }` } xs={6} md={4} lg={3}>
						<Form.Check
							className="pt-1"
							type="checkbox"
							id={`checkbox-${ dayName }`}
							label={ dayNamePL.charAt(0).toUpperCase() + dayNamePL.slice(1) }
							onChange={ (e) => dispatch( setFreeDays( dayName, e.target.checked ) ) }
							checked={ ( freeDays[ dayName ] !== null ) ? true : false }
							custom />
					</Col>
				)
			}) }
		</Row>
		{ Object.entries( freeDays ).map( ([ dayName, freeDay ]) => {
			if ( freeDay !== null ) {
				let dayNamePL = moment().day( dayName ).locale('pl').format('dddd')

				return (
					<Row key={ `free-days-table-${ dayName }` } className="show-grid align-items-center mb-2">
						<Col >
							{ dayNamePL.charAt(0).toUpperCase() + dayNamePL.slice(1) }
						</Col>
						<Col xs={3} lg={2}>
							<Form.Control className="text-center" type="text" size="sm" value={ freeDay.index } onChange={ (e) => dispatch( updateFreeDays( dayName, "index", e.target.value ) ) }/>
						</Col>
						<Col xs={"auto"}>
							<Form.Check type="checkbox" id={`checkbox-permanent-${ dayName }`} label="Stałe" onChange={ (e) => dispatch( updateFreeDays( dayName, "permanent", e.target.checked ) ) } checked={ freeDay.permanent } custom />
						</Col>
						<Col xs={12}/>
					</Row>
				)
			}
		})}

	</>)
}

export default DailyBreakControl
