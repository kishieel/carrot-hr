import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap'
import { updateSettings } from '../../actions/settings'

const OpenningClossingControl = ( ) => {
	const dispatch = useDispatch()
	// const maxWorkTime = useSelector( state => state.settings.maxWorkTime )

	return (<>
		<Row className="show-grid align-items-center mb-2">
		</Row>
	</>)
}

export default OpenningClossingControl
