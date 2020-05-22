import React from 'react'
import { Modal, Container, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux'
import { showEmployeeSettings } from '../../actions/temporary'
import Signature from './Signature'
import TimeContract from './TimeContract'
import Role from './Role'

const EmployeeSettings = (props) => {
	const dispatch = useDispatch()
	const { show, employeeId  } = useSelector( state => state.temporary.employeeSettings)

	return (
		<Modal show={ show } onHide={ () => dispatch( showEmployeeSettings( false, 0 ) ) } size="lg">
			<Modal.Header closeButton>
				<Modal.Title>
					Panel pracownika
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container>
					<Signature employeeId={ employeeId }/>
					<TimeContract employeeId={ employeeId }/>
					<Role employeeId={ employeeId }/>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="danger" onClick={ () => {} }> Usuń </Button>
				<Button onClick={ () => dispatch( showEmployeeSettings( false, 0 ) ) }> Zamknij </Button>
			</Modal.Footer>
		</Modal>
	)
}

export default EmployeeSettings
