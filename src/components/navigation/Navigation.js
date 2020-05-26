import React from 'react'
import { Navbar, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { saveSchedules, loadSchedules } from '../../actions/default'
import { changeLayer } from '../../actions/temporary'
import ScheduleSettings from './ScheduleSettings'

const Navigation = ( props ) => {
	const dispatch = useDispatch()
	const { timeLayer, absenceLayer } = useSelector( state => state.temporary )

	let fileUploader = null
	const handleOnLoaderChange = (e) => {
		const reader = new FileReader();
		reader.onload = ((reader) => {
			return () => {
				const payload = JSON.parse(reader.result);
				dispatch( loadSchedules( payload ) )
			}
		})(reader);
		reader.readAsText(e.target.files[0]);
		e.target.value = '';
	}

	return (<>
		<Navbar collapseOnSelect expand="lg" bg="light" variant="light">
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<ScheduleSettings />
				<Button className="mr-2 mt-2 mt-lg-0" variant="outline-dark" onClick={ () => dispatch( saveSchedules() ) }><b> Zapisz </b></Button>
				<Button className="mr-2 mr-lg-4 mt-2 mt-lg-0" variant="outline-dark" type="input" onClick={ () => { fileUploader.click() } }><b> Wczytaj </b></Button>
				<Button className="mr-2 mt-2 mt-lg-0" variant="outline-success" onClick={ () => { } }><b> Generuj </b></Button>
				<Button className="mr-2 mr-lg-4 mt-2 mt-lg-0" variant="outline-danger" onClick={ () => { } }><b> Wyczyść </b></Button>
				<Button className="mr-2 mt-2 mt-lg-0 text-nowrap" variant="outline-info" onClick={ () => dispatch( changeLayer( "absenceLayer", !absenceLayer) ) }><b>{ ( absenceLayer === false ) ? "Pokaż absencje" : "Ukryj absencje" }</b></Button>
				<Button className="mr-2 mr-lg-4 mt-2 mt-lg-0 text-nowrap" variant="outline-info" onClick={ () => dispatch( changeLayer( "timeLayer", !timeLayer) ) }><b>{ ( timeLayer === false ) ? "Pokaż czas" : "Ukryj czas" }</b></Button>
				<input ref={ input => fileUploader = input } className="d-none" type="file" onChange={ (e) => handleOnLoaderChange(e) }/>
			</Navbar.Collapse>
		</Navbar>
	</>)
}

export default Navigation
