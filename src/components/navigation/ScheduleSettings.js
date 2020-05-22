import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, Form, Container, Row, Col } from 'react-bootstrap'
import { updateBillingPeriod, updateBillingType } from '../../actions/settings'
import { selectBillingPeriodName } from '../../selectors/settings'

const BillingPeriods = ( props ) => {
	const { billingType } = props

	if ( billingType === "QUARTER" ) {
		return (<>
			{ ["2020-01", "2020-04", "2020-07", "2020-10" ].map(billingPeriod => {
				return ( <option key={ `Q:${billingPeriod}` } value={billingPeriod}>{ selectBillingPeriodName( billingType, billingPeriod ) }</option> )
			}) }
		</>)
	}

	return (<>
		{ ["2020-01", "2020-02", "2020-03", "2020-04", "2020-05", "2020-06", "2020-07", "2020-08", "2020-09", "2020-10", "2020-11", "2020-12" ].map(billingPeriod => {
			return ( <option key={ `M:${billingPeriod}` }  value={ billingPeriod }>{ selectBillingPeriodName( billingType, billingPeriod ) }</option> )
		}) }
	</>)
}

const Billing = ( props ) => {
	const dispatch = useDispatch()
	const billingType = useSelector( state => state.settings.billingType )
	const billingPeriod = useSelector( state => state.settings.billingPeriod )

	return (<>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={7} lg={8}>
				Rodzaj okresu rozliczeniowy:
			</Col>
			<Col sm={5} lg={4}>
			<Form.Control as="select" value={ billingType } onChange={ (e) => dispatch( updateBillingType( e.target.value ) ) } custom>
				<option value={"MONTH"}>Miesięczny</option>
				<option value={"QUARTER"}>Kwartalny</option>
			</Form.Control>
			</Col>
		</Row>
		<Row className="show-grid align-items-center mb-2">
			<Col sm={7} lg={8}>
				Okres rozliczeniowy:
			</Col>
			<Col sm={5} lg={4}>
			<Form.Control as="select" value={ billingPeriod } onChange={ (e) => dispatch( updateBillingPeriod( e.target.value ) ) } custom>
				<BillingPeriods billingType={ billingType }/>
			</Form.Control>
			</Col>
		</Row>
	</>)
}

const ScheduleSettings = ( props ) => {
	const [show, setShow] = useState(false);
	// const dispatch = useDispatch();

	return (<>
		<Button className="mr-4" variant="outline-warning" onClick={ () => setShow(true) } ><b> Ustawienia </b></Button>
		<Modal show={ show } onHide={ () => setShow(false) } size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					Panel Carrot<b>HR</b>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<Billing />
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={ () => setShow(false) }> Zamknij </Button>
			</Modal.Footer>
		</Modal>
	</>)
}

export default ScheduleSettings
