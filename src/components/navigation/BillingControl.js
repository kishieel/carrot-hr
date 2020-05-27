import React from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Col } from 'react-bootstrap'
import { updateSettings, updateBillingType } from '../../actions/settings'
import { selectBillingPeriodName } from '../../selectors/settings'

const getBillingPeriods = ( billingType ) => {
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

const BillingControl = ( props ) => {
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
			<Form.Control as="select" value={ billingPeriod } onChange={ (e) => dispatch( updateSettings( "billingPeriod", e.target.value ) ) } custom>
				{ getBillingPeriods( billingType ) }
			</Form.Control>
			</Col>
		</Row>
	</>)
}

export default BillingControl
