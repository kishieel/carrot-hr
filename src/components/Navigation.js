import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Navbar, Button } from 'react-bootstrap';
import Settings from './Settings'

const mapStateToProps = (state) => {
  	return {
		is_absences_layer: state.settings.is_absences_layer,
		is_time_layer: state.settings.is_time_layer,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		onSave: () => dispatch({ type: 'SAVE' }),
		onLoaded: (payload) => dispatch({ type: 'LOADED', payload: payload }),
		onGenerate: () => dispatch({ type: 'GENERATE' }),
		onClear: () => dispatch({ type: 'CLEAR_SCHEDULE' }),
		onAbsences: () => dispatch({ type: 'ABSENCES' }),
		onWorkTime: () => dispatch({ type: 'WORK_TIME' }),
		onUndo: () => dispatch({ type: 'UNDO' }),
		onRedo: () => dispatch({ type: 'REDO' }),
	}
};

class Navigation extends Component {
	handleOnLoaderChange = (e) => {
		const reader = new FileReader();
		reader.onload = ((reader) => {
			return () => {
				const json = JSON.parse(reader.result);
				this.props.onLoaded(json);
			}
		})(reader);
		reader.readAsText(e.target.files[0]);
		e.target.value = '';
	}

	render() {
		const { is_absences_layer, is_time_layer, onSave, onGenerate, onClear, onAbsences, onWorkTime, onUndo, onRedo } = this.props;

		return ( <>
			<Navbar bg="light">
				<Settings />
				<Button className="mr-2" variant="outline-dark" onClick={ onSave } ><b> Zapisz </b></Button>
				<Button className="mr-4" variant="outline-dark" type="input" onClick={ () => { this.fileUploader.click() } } ><b> Wczytaj </b></Button>
				<Button className="mr-2" variant="outline-success" onClick={ onGenerate } ><b> Generuj </b></Button>
				<Button className="mr-4" variant="outline-danger" onClick={ onClear } ><b> Wyczyść </b></Button>
				<Button className="mr-2 text-nowrap" variant="outline-info" onClick={ onAbsences } ><b>
					{ ( is_absences_layer === false ) ? "Pokaż absencje" : "Ukryj absencje" }
				</b></Button>
				<Button className="mr-4 text-nowrap" variant="outline-info" onClick={ onWorkTime } ><b>
					{ ( is_time_layer === false ) ? "Pokaż czas pracy" : "Ukryj czas pracy" }
				</b></Button>
				<Button className="mr-2" variant="outline-dark" onClick={ onUndo } ><b> Cofnij </b></Button>
				<Button className="mr-2" variant="outline-dark" onClick={ onRedo } ><b> Przywróć </b></Button>
				<input ref={ input => this.fileUploader = input } className="d-none" type="file" onChange={ (e) => this.handleOnLoaderChange(e) }/>
			</Navbar>
		</> );
	}
}

export default Navigation = connect(mapStateToProps, mapDispatchToProps)(Navigation);
