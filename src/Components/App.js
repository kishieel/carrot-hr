import React, { Component } from 'react';
import EmployeesTableManager from './EmployeesTableManager';
import SettingsManager from './SettingsManager';
import './App.scss';

const format = require('date-format');

// + ZROBIONE
// ~ PRAWIE ZROBIONE
// ! NASTĘPNE W PLANIE

// [+] TODO 2 : Zapis i odczyt stanu menadżera tabeli do/z pliku
// [+] TODO 3 : Zapis preferencji po edytowaniu pola, przypisanie polu oznaczenia preferencji
// [+] TODO 4 : Auto generowanie planu pracy na podstawie preferencji
// [ ] TODO 5 : Poprzenosic wszystkie kompo-funkcje do osobnych plików
// [+] TODO 6 : Cieszyc sie że choć jeden projekt posuwa się do przodu :3
// [~] TODO 7 : Przygotować szablon ustawień
// [+] TODO 8 : Zablokować możliwość edycji dni wolnych od pracy
// [ ] TODO 9 : Automatyczne generowanie dat według kwartału ustawionego w ustawieniach
// [+] TODO 10 : Oznaczenie świąt
// [ ] TODO 11 : Zwracanie dnia wolnego za sobotę.
// [!] TODO 12 : Przygotowanie modal'a z wszystkimi ustawieniami
// [ ] TODO 13 : Ujmowanie czasu pracy pracownikom z preferencjami


// Returns the name of the day based on a date
const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const getDayName = (date) => {
	let dt = new Date(date);
	return days[dt.getDay()];
}

// Working same as Array.prototype.filter, but it's cut filtered elements from orginal array if they satisfy condition in predication
const select = (arr, predicate) => {
    if (typeof predicate != "function")
      	throw new TypeError();

    var selected = arr.filter( x => {
		return (predicate.call(arr[0], x, arr))
	})

	for ( const val of selected ) {
		let i = arr.indexOf( val )
		arr.splice(i,1)
	}

    return selected;
};

// Chunks the array into parts
const chunk = (arr, size) => Array.from( { length: Math.ceil(arr.length / size) }, (v, i) =>
	arr.slice(i * size, i * size + size)
);

// Copies arrays without any references
const duplicate = (arr) => { return JSON.parse(JSON.stringify(arr)) };

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			settings: {
				free_per_day: 13,	// Minimalna przerwa między podjęciem następnej zmiany
				free_per_weekfree_per_week: 35, // Minimalna przerwa tygodniowa
				free_indexs: [ // Wpisy które ujmują 8h pracy
					"NP", "SP", "L4", "UW", "DU", "ZZ", "UO"
				],
				free_days: {  // Ustawienia dni tygodnia, wolne i jego rodzaj
					sun: {
						shift: "N",
						permanent: true,
					},
					mon: null,
					tue: null,
					wed: null,
					thu: null,
					fri: null,
					sat: {
						shift: "S",
						permanent: false,
					},
				},
				min_per_shift: { // Minimalna załoga pracownicza na zmianie danego dnia
					sun: {
						shift_1: 0,
						shift_2: 0,
						shift_3: 0,
					},
					mon: {
						shift_1: 5,
						shift_2: 5,
						shift_3: 0,
					},
					tue: {
						shift_1: 4,
						shift_2: 4,
						shift_3: 0,
					},
					wed: {
						shift_1: 5,
						shift_2: 4,
						shift_3: 0,
					},
					thu: {
						shift_1: 4,
						shift_2: 4,
						shift_3: 0,
					},
					fri: {
						shift_1: 4,
						shift_2: 4,
						shift_3: 0,
					},
					sat: {
						shift_1: 5,
						shift_2: 4,
						shift_3: 0,
					},
				},
				holidays: [ // Święta ustawowo wolne
					{ 	date: "2020-01-01", 	shift: "WS" 	},
					{ 	date: "2020-01-06", 	shift: "WS" 	},
					{ 	date: "2020-04-11", 	shift: "WS" 	},
					{ 	date: "2020-04-13", 	shift: "WS" 	},
					{ 	date: "2020-05-01", 	shift: "WS" 	},
					{ 	date: "2020-05-03", 	shift: "WS" 	},
					{ 	date: "2020-05-31", 	shift: "WS" 	},
					{ 	date: "2020-06-11", 	shift: "WS" 	},
					{ 	date: "2020-08-15", 	shift: "WS" 	},
					{ 	date: "2020-11-01", 	shift: "WS" 	},
					{ 	date: "2020-11-11", 	shift: "WS" 	},
					{ 	date: "2020-12-25", 	shift: "WS" 	},
					{ 	date: "2020-12-16", 	shift: "WS" 	},
				],
				is_absences_layer: false,
				is_time_layer: false,
			},
			employee_next_id: 14,
			employees: [
				// {	id: 0,	signature: "Adam Nowak",	time_contract: 1,	roles: []	},
				{	id: 1,	signature: "Adam Nowak",	time_contract: 1,	roles: [ "KASJER" ]	},
				{	id: 2,	signature: "Hubert Lipa",	time_contract: 1,	roles: [ "KASJER" ]	},
				{	id: 3,	signature: "Karolina Pama",	time_contract: 1,	roles: [ "ZASTĘPCA" ]	},
				{	id: 4,	signature: "Dawid Zsiadło",	time_contract: 1,	roles: [ "STARSZY KASJER" ]	},
				{	id: 5,	signature: "Andrzej Jawor",	time_contract: 1,	roles: [ "KIEROWNIK" ]	},
				{	id: 6,	signature: "Tomasz Budyń",	time_contract: 1,	roles: [ "KASJER" ]	},
				{	id: 7,	signature: "Joanna Kwas",	time_contract: .75,	roles: [ "KASJER" ]	},
				{	id: 8,	signature: "Adam Małysz",	time_contract: .75,	roles: [ "KASJER" ]	},
				{	id: 9,	signature: "Kawaii Omate",	time_contract: 1,	roles: [ "ZASTĘPCA" ]	},
				{	id: 10,	signature: "Siergiej Oli",	time_contract: 1,	roles: [ "ZASTĘPCA" ]	},
				{	id: 11,	signature: "Jan Polak",		time_contract: 1,	roles: [ "KASJER" ]	},
				{	id: 12,	signature: "Hans Niemiec",	time_contract: 1,	roles: [ "KASJER" ]	},
				{	id: 13,	signature: "John States",	time_contract: .5,	roles: [ "KASJER" ]	},
			],
			dates: [
				"2020-04-01", "2020-04-02", "2020-04-03", "2020-04-04", "2020-04-05", "2020-04-06", "2020-04-07",
				"2020-04-08", "2020-04-09", "2020-04-10", "2020-04-11", "2020-04-12", "2020-04-13", "2020-04-14",
				"2020-04-15", "2020-04-16", "2020-04-17", "2020-04-18", "2020-04-19", "2020-04-20", "2020-04-21",
				"2020-04-22", "2020-04-23", "2020-04-24", "2020-04-25", "2020-04-26", "2020-04-27", "2020-04-28",
				"2020-04-29", "2020-04-30", "2020-05-01", "2020-05-02", "2020-05-03", "2020-05-04", "2020-05-05",
			 	"2020-05-06", "2020-05-07", "2020-05-08", "2020-05-09", "2020-05-10", "2020-05-11", "2020-05-12",
			 	"2020-05-13", "2020-05-14", "2020-05-15", "2020-05-16", "2020-05-17", "2020-05-18", "2020-05-19",
			 	"2020-05-20", "2020-05-21", "2020-05-22", "2020-05-23", "2020-05-24", "2020-05-25", "2020-05-26",
				"2020-05-27", "2020-05-28", "2020-05-29", "2020-05-30", "2020-05-31", "2020-06-01", "2020-06-02",
				"2020-06-03", "2020-06-04", "2020-06-05", "2020-06-06", "2020-06-07", "2020-06-08", "2020-06-09",
				"2020-06-10", "2020-06-11", "2020-06-12", "2020-06-13", "2020-06-14", "2020-06-15", "2020-06-16",
				"2020-06-17", "2020-06-18", "2020-06-19", "2020-06-21", "2020-06-22", "2020-06-23", "2020-06-24",
				"2020-06-25", "2020-06-26", "2020-06-27", "2020-06-28", "2020-06-29", "2020-06-30",
			],
			// preferences: [],
			schedules: [
				// { 	employee_id: 0, 	date: "03-04-2020", 	begin: "06:00:00",		end: "14:00:00",	preference: false 	},
			],
			absences: [
				// {	employee_id: 0,		date: "03-04-2020",		index: "L4"  }
			]
		}

		this.handleOnSaveClick = this.handleOnSaveClick.bind(this);
		this.handleOnUploadClick = this.handleOnUploadClick.bind(this);
		this.handleOnUploadChange = this.handleOnUploadChange.bind(this);

		this.handleOnGenerateClick = this.handleOnGenerateClick.bind(this);
		this.handleOnClearClick = this.handleOnClearClick.bind(this);

		this.handleOnShowAbsencesClick = this.handleOnShowAbsencesClick.bind(this);
		this.handleOnShowTimeClick = this.handleOnShowTimeClick.bind(this);

		this.handleOnUndoClick = this.handleOnUndoClick.bind(this);
		this.handleOnRedoClick = this.handleOnRedoClick.bind(this);

		this.handleOnNewEmployee = this.handleOnNewEmployee.bind(this);

		this.handleOnScheduleBeginChange = this.handleOnScheduleBeginChange.bind(this);
		this.handleOnScheduleEndChange = this.handleOnScheduleEndChange.bind(this);
		// this.pushSchedule = this.pushSchedule.bind(this);
	}

	handleOnSaveClick() {
		const element = document.createElement("a");
		const file = new Blob([JSON.stringify(this.state)], {type: 'application/json'});
		element.href = URL.createObjectURL(file);
		element.download = format.asString('dd-MM-yyyy hh:mm', new Date());
		document.body.appendChild(element);
		element.click();
	}

	handleOnUploadClick() {
		this.refs.fileUploader.click();
	}

	handleOnUploadChange(e) {
		var reader = new FileReader();
		reader.onload = ((reader) => {
			return () => {
				const json = JSON.parse(reader.result);
				this.setState( {
					settings: json.settings,
					employees: json.employees,
					employee_next_id: json.employee_next_id,
					schedules: json.schedules,
					absences: json.absences,
				} );
			}
		})(reader);

		reader.readAsText(e.target.files[0]);
	}

	handleOnGenerateClick() { }

	handleOnClearClick() {
		this.setState( { schedules: [ ]} )
	}

	handleOnShowAbsencesClick() {
		let settings_temp = { ...this.state.settings }
		settings_temp.is_absences_layer = !settings_temp.is_absences_layer;
		settings_temp.is_time_layer = false;
		this.setState( { settings: { ...settings_temp } } );
	}

	handleOnShowTimeClick() {
		let settings_temp = { ...this.state.settings }
		settings_temp.is_time_layer = !settings_temp.is_time_layer;
		settings_temp.is_absences_layer = false;
		this.setState( { settings: { ...settings_temp } } );
	}

	handleOnUndoClick() { }

	handleOnRedoClick() { }

	handleOnNewEmployee(e) {
		if (e.key === "Enter") {
			const employee = {
				id: this.state.employee_next_id,
				signature: e.target.value,
				time_contract: 1,
				roles: []
			}

			this.setState( { employees: [ ...this.state.employees, employee], employee_next_id: this.state.employee_next_id + 1 } );
			e.target.value = "";
		}
	}

	handleOnScheduleBeginChange(e) {
		let schedules_temp = [ ...this.state.schedules ]
		schedules_temp = schedules_temp.filter(schedule => { return !(
			schedule.employee_id == e.target.getAttribute('data-employee-id') &&
			schedule.date == e.target.getAttribute('data-date-id')
		)});

		let schedule_temp = [ ...this.state.schedules ].find(schedule => { return (
			schedule.employee_id == e.target.getAttribute('data-employee-id') &&
			schedule.date == e.target.getAttribute('data-date-id')
		)});

		if ( e.target.value != "" ) {
			const schedule = {
				employee_id: parseInt( e.target.getAttribute('data-employee-id') ),
				date: e.target.getAttribute('data-date-id'),
				begin: e.target.value.toUpperCase(),
				end: ( schedule_temp ) ? schedule_temp.end : "",
				preference: true,
			}
			this.setState( { schedules: [ ...schedules_temp, schedule ] } );
		} else {
			this.setState( { schedules: [ ...schedules_temp ] } );
		}
	}

	handleOnScheduleEndChange(e) {
		let schedules_temp = [ ...this.state.schedules ].filter(schedule => { return !(
			schedule.employee_id == e.target.getAttribute('data-employee-id') &&
			schedule.date == e.target.getAttribute('data-date-id')
		)});

		let schedule = [ ...this.state.schedules ].find(schedule => { return (
			schedule.employee_id == e.target.getAttribute('data-employee-id') &&
			schedule.date == e.target.getAttribute('data-date-id')
		)});
		schedule.end = e.target.value;

		this.setState( { schedules: [ ...schedules_temp, schedule ] } );
	}

	// pushSchedule( p_schedule ) { }

	// pushSchedules( p_schedules ) { }


	// <button className="btn btn-outline-primary font-weight-bold mr-2" type="button">Pokaż preferencje</button>
	// <button className="btn btn-outline-danger font-weight-bold mr-4" type="button" onClick={ this.handleOnClearPreferencesClick }>Usuń preferencje</button>

	// ustawienia - zapisz - wczytaj - generuj plan pracy - wyczysc plan pracy - pokaz/ukryj absencje - pokaz/ukryj czas pracy - cofnij - przywroc


	render() {
		return (
			<>
				<nav className="navbar navbar-light bg-light">
					<form>
						<SettingsManager settings={ this.state.settings } />
						<button className="btn btn-outline-dark font-weight-bold mr-2" type="button" onClick={ this.handleOnSaveClick }>Zapisz</button>
						<button className="btn btn-outline-dark font-weight-bold mr-4" type="button" onClick={ this.handleOnUploadClick }>Wczytaj</button>
				    	<button className="btn btn-outline-success font-weight-bold mr-2" type="button" onClick={ this.handleOnGenerateClick }>Generuj plan pracy</button>
						<button className="btn btn-outline-danger font-weight-bold mr-4" type="button" onClick={ this.handleOnClearClick }>Wyczyść plan pracy</button>
						<button className="btn btn-outline-info font-weight-bold mr-2" type="button" onClick={ this.handleOnShowAbsencesClick }>
							{ ( this.state.settings.is_absences_layer === false ) ? "Pokaż absencje" : "Ukryj absencje" }
						</button>
						<button className="btn btn-outline-info font-weight-bold mr-4" type="button" onClick={ this.handleOnShowTimeClick }>
							{ ( this.state.settings.is_time_layer === false ) ? "Pokaż czas pracy" : "Ukryj czas pracy" }
						</button>
						<button className="btn btn-outline-dark font-weight-bold mr-2" type="button">Cofnij</button>
				    	<button className="btn btn-outline-dark font-weight-bold mr-2" type="button">Przywróć</button>
						<input ref="fileUploader" className="d-none" type="file" onChange={ this.handleOnUploadChange }/>
					</form>
				</nav>
				<EmployeesTableManager settings={ this.state.settings } employees={this.state.employees} dates={this.state.dates} schedules={this.state.schedules} onNewEmployee={this.handleOnNewEmployee} onScheduleBeginChange={this.handleOnScheduleBeginChange} onScheduleEndChange={this.handleOnScheduleEndChange}/>
			</>
	    );
	}
}
