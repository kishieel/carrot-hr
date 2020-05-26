import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap'
import { updateSettings } from '../../actions/settings'

const WorkTimeControl = ( ) => {
	const dispatch = useDispatch()
	const maxWorkTime = useSelector( state => state.settings.maxWorkTime )

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={9} lg={10}>
				Maksymalny dzienny czas pracy:
			</Col>
			<Col sm={3} lg={2}>
				<Form.Control className="text-center" type="text" placeholder="0:00" value={ maxWorkTime } onChange={ (e) => dispatch( updateSettings( "maxWorkTime", e.target.value ) )}/>
			</Col>
		</Row>
	</>)
}

export default WorkTimeControl
