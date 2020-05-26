import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { getDatesFromPeriod } from '../helpers'

const GenerateButton = (props) => {
	const dispatch = useDispatch()
	const { billing_period, billing_period_type, daily_time, daily_break, weekly_break, free_days, shifts_crew, shifts_time } = useSelector( state => state.settings )
	const employees = useSelector( state => state.employees )
	const dates = getDatesFromPeriod( billing_period, billing_period_type )

	return (
		<Button className="mr-2" variant="outline-success" onClick={ () => dispatch({ type: "SCHEDULE_GENERATE", employees: employees, settings: { daily_time, daily_break, weekly_break, free_days, shifts_crew, shifts_time, billing_period, billing_period_type }, dates: dates }) } ><b> Generuj </b></Button>
	)
}

export default GenerateButton
