import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap'
import { updateSettings } from '../../actions/settings'

const WeeklyBreakControl = ( ) => {
	const dispatch = useDispatch()
	const minWeeklyBreak = useSelector( state => state.settings.minWeeklyBreak )

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={9} lg={10}>
				Minimalna tygodniowa przerwa:
			</Col>
			<Col sm={3} lg={2}>
				<Form.Control className="text-center" type="text" placeholder="0:00" value={ minWeeklyBreak } onChange={ (e) => dispatch( updateSettings( "minWeeklyBreak", e.target.value ) ) }/>
			</Col>
		</Row>
	</>)
}

export default WeeklyBreakControl
