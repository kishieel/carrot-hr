import React from 'react'
import { useSelector } from 'react-redux'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { selectFreeDaysState } from '../../selectors/schedules'
import { validFreeDays } from '../../validators'

const FreeDaysStateCell = React.memo( ( props ) => {
	const { employeeId } = props
	const freeDaysState = useSelector( selectFreeDaysState( employeeId ) )
	const validation = validFreeDays( freeDaysState )

	if ( validation.status === false ) {
		return (<>
			<OverlayTrigger overlay={
				<Tooltip style={{ whiteSpace: "pre-line" }}> { validation.message } </Tooltip>
			}>
				<th className="text-center align-middle schedules__field--warning">&#10008;</th>
			</OverlayTrigger>
		</>)
	}

	return (<>
		<th className="text-center align-middle">&#10004;</th>
	</>)
})

export default FreeDaysStateCell
