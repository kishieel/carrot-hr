import React, { useState } from 'react'
import { Button, Modal, Form, Container, Row, Col } from 'react-bootstrap'
import BillingControl from './BillingControl'
import WorkTimeControl from './WorkTimeControl'
import DailyBreakControl from './DailyBreakControl'
import WeeklyBreakControl from './WeeklyBreakControl'
import FreeDaysControl from './FreeDaysControl'
import ShiftTimesControl from './ShiftTimesControl'
import OpenningClossingControl from './OpenningClossingControl'
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
					<ShiftTimesControl />
					<OpenningClossingControl /><hr />
					<ShiftsCrewControl />
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={ () => setShow(false) }> Zamknij </Button>
			</Modal.Footer>
		</Modal>
	</>)
}


export default ScheduleSettings
