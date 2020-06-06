import React from 'react'
import { useSelector } from 'react-redux'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { selectWorkTimeState } from '../../selectors/schedules'
import { validWorkTime } from '../../validators'

const WorkTimeStateCell = React.memo( ( props ) => {
	const { employeeId } = props
	const workTime = useSelector( selectWorkTimeState( employeeId ) )
	const validation = validWorkTime( workTime )

	if ( validation.status === false ) {
		return (<>
			<OverlayTrigger overlay={
				<Tooltip style={{ whiteSpace: "pre-line" }}> { validation.message } </Tooltip>
			}>
				<th className="text-center align-middle schedules__field--warning">{ Math.floor( workTime * 100 ) / 100 }</th>
			</OverlayTrigger>
		</>)
	}

	return (<>
		<th className="text-center align-middle">{ Math.floor( workTime * 100 ) / 100 }</th>
	</>)
})

export default WorkTimeStateCell
