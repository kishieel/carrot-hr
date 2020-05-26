import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap'
import { updateSettings } from '../../actions/settings'

const DailyBreakControl = ( ) => {
	const dispatch = useDispatch()
	const minDailyBreak = useSelector( state => state.settings.minDailyBreak )

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={9} lg={10}>
				Minimalna przerwa między zmianami:
			</Col>
			<Col sm={3} lg={2}>
				<Form.Control className="text-center" type="text" placeholder="0:00" value={ minDailyBreak } onChange={ (e) => dispatch( updateSettings( "minDailyBreak", e.target.value ) )}/>
			</Col>
		</Row>
	</>)
}

export default DailyBreakControl
