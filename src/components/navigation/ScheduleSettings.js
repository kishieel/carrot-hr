import React, { useState } from 'react'
import { Button, Modal, Container } from 'react-bootstrap'
import BillingControl from './BillingControl'
import WorkTimeControl from './WorkTimeControl'
import DailyBreakControl from './DailyBreakControl'
import WeeklyBreakControl from './WeeklyBreakControl'
import FreeDaysControl from './FreeDaysControl'
import ShiftsControl from './ShiftsControl'
import ShiftsCrewControl from './ShiftsCrewControl'

const ScheduleSettings = ( props ) => {
	const [show, setShow] = useState(false);

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
					<BillingControl />
					<WorkTimeControl />
					<DailyBreakControl />
					<WeeklyBreakControl /><hr/>
					<FreeDaysControl /><hr />
					<ShiftsControl />
					<ShiftsCrewControl />
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={ () => setShow(false) }> Zamknij </Button>
			</Modal.Footer>
		</Modal>
	</>)
}
// <ShiftsCrewControl />


export default ScheduleSettings
