import React from 'react'
import { useSelector } from 'react-redux'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { selectDailyCrewState } from '../../selectors/schedules'
import { validDailyCrew } from '../../validators'

const moment = require('moment')

const SchedulesColHeader = ( props ) => {
	const { date } = props
	const validation = useSelector( validDailyCrew( date ) )

	let m = moment(date)
	if ( validation.status === false ) {
		return (<>
			<OverlayTrigger placement="bootom" overlay={
				<Tooltip style={{ whiteSpace: "pre-line" }}> { validation.message } </Tooltip>
			}>
				<th key={ m.format('DD-MM') } className="text-nowrap text-center p-0 schedules__field--warning">
					<span className="px-3">{ m.format('DD-MM') }</span><hr className="m-0"/>
					<span className="px-3">{ m.locale('pl').format('dd').toUpperCase() }</span>
				</th>
			</OverlayTrigger>
		</>)
	}

	return (<>
		<th key={ m.format('DD-MM') } className="text-nowrap text-center p-0">
			<span className="px-3">{ m.format('DD-MM') }</span><hr className="m-0"/>
			<span className="px-3">{ m.locale('pl').format('dd').toUpperCase() }</span>
		</th>
	</>)
}

export default SchedulesColHeader
