import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function SettingsManager(props) {
	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	return (
		<>
			<button className="btn btn-outline-info font-weight-bold mr-4" type="button" onClick={ handleShow }>Ustawienia</button>
			<Modal size="lg" show={show} onHide={handleClose}>
		    	<Modal.Header closeButton>
		      		<Modal.Title>Ustawienia</Modal.Title>
		    	</Modal.Header>
		    	<Modal.Body>
					...
				</Modal.Body>
		  	</Modal>
		</>
	);
}
