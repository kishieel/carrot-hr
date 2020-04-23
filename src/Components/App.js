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
			},
			employee_next_id: 1,
			employees: [
				// {	id: 0,	signature: "Adam Nowak",	time_contract: 1,	vod: 24,	is_super_manager: false,	is_manager: false	},
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
				// { 	employee_id: 0, 	date: "03.04.2020", 	shift: 1,	preference: false 	},
			]
		}

		this.onSaveClick = this.onSaveClick.bind(this);
		this.onUploadClick = this.onUploadClick.bind(this);
		this.onUploadChange = this.onUploadChange.bind(this);
		this.handleOnClearClick = this.handleOnClearClick.bind(this);
		this.handleOnClearPreferencesClick = this.handleOnClearPreferencesClick.bind(this);
		this.handleOnNewEmployee = this.handleOnNewEmployee.bind(this);
		// this.handleOnPreferenceChange = this.handleOnPreferenceChange.bind(this);
		this.handleOnGenerateClick = this.handleOnGenerateClick.bind(this);
		this.handleOnScheduleChange = this.handleOnScheduleChange.bind(this);
		this.pushSchedule = this.pushSchedule.bind(this);
	}

	handleOnClearClick() {
		let schedules_temp = [ ];
		schedules_temp = this.state.schedules.filter(schedule => { return schedule.preference === true });
		console.log(schedules_temp)
		this.setState( { schedules: [ ...schedules_temp ]} )
	}

	handleOnClearPreferencesClick() {
		let schedules_temp = [ ...this.state.schedules ];
		schedules_temp.map(schedule => { schedule.preference = false });
		this.setState( { schedules: [ ...schedules_temp ]} )
	}

	onSaveClick() {
		const element = document.createElement("a");
		const file = new Blob([JSON.stringify(this.state)], {type: 'application/json'});
		element.href = URL.createObjectURL(file);
		element.download = format.asString('dd-MM-yyyy hh:mm', new Date());
		document.body.appendChild(element);
		element.click();
	}

	onUploadClick() {
		this.refs.fileUploader.click();
	}

	onUploadChange(e) {
		var reader = new FileReader();
        reader.onload = ((reader) => {
            return () => {
                const json = JSON.parse(reader.result);
				this.setState( {
					employees: json.employees,
					employee_next_id: json.employee_next_id,
					settings: json.settings,
					preferences: json.preferences,
					schedules: json.schedules,
				} );
            }
        })(reader);

        reader.readAsText(e.target.files[0]);
	}

	handleOnNewEmployee(e) {
		if (e.key === "Enter") {
			const employee = { id: this.state.employee_next_id,	signature: e.target.value,	time_contract: 1,	vod: 24, is_super_manager: false, is_manager: false }
			this.setState( { employees: [ ...this.state.employees, employee], employee_next_id: this.state.employee_next_id + 1 } );
			e.target.value = "";
		}
	}

	handleOnScheduleChange(e) {
		let schedules_temp = [ ...this.state.schedules ]
		schedules_temp = schedules_temp.filter(schedule => { return !(
			schedule.employee_id == e.target.getAttribute('data-employee-id') &&
			schedule.date == e.target.getAttribute('data-date-id')
		)});

		if ( e.target.value != "" ) {
			const schedule = {
				employee_id: parseInt( e.target.getAttribute('data-employee-id') ),
				date: e.target.getAttribute('data-date-id'),
				shift: e.target.value.toUpperCase(),
				preference: true,
			}
			this.setState( { schedules: [ ...schedules_temp, schedule ] } );
		} else {
			this.setState( { schedules: [ ...schedules_temp ] } );
		}
	}

	getMostBored( employees ) {
		if ( employees.length === 0 ) return;
		let mostBored = employees[0];
		for ( const employee of employees ) {
			if ( mostBored.time < employee.time ) {
				mostBored = employee;
			}
		}
		return mostBored
	}

	pushSchedule( p_schedule ) {
		let schedules_temp = [ ...this.state.schedules ]
		schedules_temp = schedules_temp.filter(schedule => { return !(
			schedule.employee_id == parseInt(p_schedule.employee_id) &&
			schedule.date == p_schedule.date
		)});

		this.setState( { schedules: [ ...schedules_temp, p_schedule ] } );
	}

	pushSchedules( p_schedules ) {
		let schedules_temp = [ ...this.state.schedules ]

		const schedules_to_remove = p_schedules.map(p_schedule => ({ employee_id: parseInt(p_schedule.employee_id), date: p_schedule.date }) )
		for ( const schedule_to_remove of schedules_to_remove ) {
			let schedule_reference = schedules_temp.find(schedule => { return ( schedule.employee_id == schedule_to_remove.employee_id && schedule.date == schedule_to_remove.date) })
			let i = schedules_temp.indexOf(schedule_reference)
			if( i >= 0 ) schedules_temp.splice(i,1)
		}

		this.setState( { schedules: [ ...schedules_temp, ...p_schedules ] } );
	}

	handleOnGenerateClick() {
		const weeks = chunk([...this.state.dates], 7);

		const employees = duplicate( [...this.state.employees] );

		let calculateTime = (div) => {
			let time = 0;
			for ( const week of weeks ) {
				for ( const date of week ) {
					let free_day = this.state.settings.free_days[ getDayName(date) ];
					let holiday = this.state.settings.holidays.find( holiday => { return ( holiday.date == date ) } )
					if ( !free_day && !holiday ) time += 1 * div;
				}
			}
			return time;
		}
		const time = calculateTime(8)

		for ( const employee of employees ) {
			employee.time = time * employee.time_contract;
		}

		const schedules = this.state.schedules.filter(schedule => { return ( schedule.preference === true ) } );; //this.state.schedules.map(schedule => { return schedule.preference === true }) ;
		const week_free_days_state = []
		for ( const week of weeks ) {

			for ( const employee of employees ) {
				employee.free_days = duplicate( {...this.state.settings.free_days} );
				let state = week_free_days_state.find(state => { return state.employee_id == employee.id })
				for ( const key in employee.free_days ) {
					if ( employee.free_days[key] ) {
						employee.free_days[key].left = 1;
						if ( state && state[key] ) employee.free_days[key].left += state[key]
					}
				}
			}

			week_free_days_state.length = 0;

			for ( const date of week ) {
				let free_day = this.state.settings.free_days[getDayName(date)];
				if ( free_day && free_day.permanent ) {
					for ( const employee of employees ) {
						employee.free_days[ getDayName(date) ].left -= 1;
						schedules.push( { employee_id: employee.id, date: date, shift: free_day.shift, preference: false } );
					}
					continue;
				}

				let holiday = this.state.settings.holidays.find( holiday => { return ( holiday.date == date ) });
				if ( holiday ) {
					for ( const employee of employees ) {
						schedules.push( { employee_id: employee.id, date: date, shift: holiday.shift, preference: false } );
					}
					continue;
				}

				const preferences = schedules.filter(schedule => { return ( schedule.date == date && schedule.preference === true ) } );

				const employees_with_preferences_id = preferences.map(preference => parseInt(preference.employee_id));

				const employees_with_preferences =  employees.filter(employee => { return ( employees_with_preferences_id.includes(employee.id) ) });
				const employees_no_preferences = employees.filter(employee => { return !( employees_with_preferences_id.includes(employee.id) ) && employee.time > 0 })
				const employees_to_free = employees.filter(employee => { return !( employees_with_preferences_id.includes(employee.id) ) && employee.time <= 0 })

				const schedules_shift_1 = preferences.filter(preference => { return ( preference.shift == 1 ) } ).map(preference => ({ employee_id: preference.employee_id, date: date, shift: 1, preference: true }) );
				const schedules_shift_2 = preferences.filter(preference => { return ( preference.shift == 2 ) } ).map(preference => ({ employee_id: preference.employee_id, date: date, shift: 2, preference: true }) );

				for ( const schedule of schedules_shift_1 ) {
					const employee = employees.find(employee => { return ( employee.id == schedule.employee_id) })
					employee.time -= 9
				}

				for ( const schedule of schedules_shift_2 ) {
					const employee = employees.find(employee => { return ( employee.id == schedule.employee_id) })
					employee.time -= 9
				}

				while ( schedules_shift_1.length < this.state.settings.min_per_shift[getDayName(date)].shift_1 ) {
					if ( employees_no_preferences.length === 0 ) break;
					const employee = this.getMostBored( employees_no_preferences );
					employee.time -= 9;

					let i = employees_no_preferences.indexOf( employee );
					employees_no_preferences.splice(i,1)

					let schedule = { employee_id: employee.id, date: date, shift: 1, preference: false}
					schedules_shift_1.push( schedule );
				}

				while ( schedules_shift_2.length < this.state.settings.min_per_shift[getDayName(date)].shift_2 ) {
					if ( employees_no_preferences.length === 0 ) break;
					const employee = this.getMostBored( employees_no_preferences );
					employee.time -= 9;

					let i = employees_no_preferences.indexOf( employee );
					employees_no_preferences.splice(i,1)

					let schedule = { employee_id: employee.id, date: date, shift: 2, preference: false}
					schedules_shift_2.push( schedule );
				}

				for ( const schedule of schedules_shift_1 ) {
					schedules.push( schedule );
				}

				for ( const schedule of schedules_shift_2 ) {
					schedules.push( schedule );
				}

				for ( const employee of employees_no_preferences ) {
					let shift = "W";
					for ( const key of ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] ) {
						if ( !employee.free_days[key] ) continue
						if ( ( this.state.settings.free_days[key].permanent === true && employee.free_days[key].left > 1 ) ||
							 ( this.state.settings.free_days[key].permanent === false && employee.free_days[key].left > 0 ) ) {
							shift = employee.free_days[key].shift;
							employee.free_days[key].left -= 1;
							break;
						}
					}
					schedules.push( { employee_id: employee.id, date: date, shift: shift, preference: false } );
				}

				for ( const employee of employees_to_free ) {
					schedules.push( { employee_id: employee.id, date: date, shift: "W", preference: false } );
				}

			}

			for ( const employee of employees ) {
				let state = {
					employee_id: employee.id,
					sun: (employee.free_days.sun) ? employee.free_days.sun.left : 0,
					mon: (employee.free_days.mon) ? employee.free_days.mon.left : 0,
					tue: (employee.free_days.tue) ? employee.free_days.tue.left : 0,
					wed: (employee.free_days.wed) ? employee.free_days.wed.left : 0,
					thu: (employee.free_days.thu) ? employee.free_days.thu.left : 0,
					fri: (employee.free_days.fri) ? employee.free_days.fri.left : 0,
					sat: (employee.free_days.sat) ? employee.free_days.sat.left : 0,
				}
				week_free_days_state.push(state)
			}

		}

		for ( const employee of employees ) {
			for ( const key of ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] ) {
				if ( !employee.free_days[key] ) continue
				while ( employee.free_days[key].left > 0 ) {
					let schedule = schedules.find(schedule => { return ( schedule.employee_id == employee.id && schedule.shift === "W" ) } )
					if ( !schedule ) break;

					schedule.shift = employee.free_days[key].shift;
					employee.free_days[key].left--;
				}
			}

			while ( employee.time > 0 ) {
				let schedule = schedules.find(schedule => { return ( schedule.employee_id == employee.id && schedule.shift === "W" && schedule.preference === false ) } );
				if ( !schedule ) break;

				schedule.shift = ( employee.id % 2 == 0) ? 1 : 2;
				employee.time -= 9;
			}
		}

		this.pushSchedules(schedules)

		console.log( employees )
	}

	// <button className="btn btn-outline-primary font-weight-bold mr-2" type="button">Pokaż preferencje</button>

	render() {
		return (
			<>
				<nav className="navbar navbar-light bg-light">
					<form>
						<SettingsManager settings={ this.state.settings } />
						<button className="btn btn-outline-dark font-weight-bold mr-2" type="button" onClick={ this.onSaveClick }>Zapisz</button>
						<button className="btn btn-outline-dark font-weight-bold mr-4" type="button" onClick={ this.onUploadClick }>Wczytaj</button>
				    	<button className="btn btn-outline-success font-weight-bold mr-2" type="button" onClick={ this.handleOnGenerateClick }>Generuj plan pracy</button>
						<button className="btn btn-outline-danger font-weight-bold mr-2" type="button" onClick={ this.handleOnClearClick }>Wyczyść plan pracy</button>
						<button className="btn btn-outline-danger font-weight-bold mr-4" type="button" onClick={ this.handleOnClearPreferencesClick }>Usuń preferencje</button>
						<button className="btn btn-outline-dark font-weight-bold mr-2" type="button">Cofnij</button>
				    	<button className="btn btn-outline-dark font-weight-bold mr-2" type="button">Przywróć</button>
						<input ref="fileUploader" className="d-none" type="file" onChange={ this.onUploadChange }/>
					</form>
				</nav>
				<EmployeesTableManager settings={ this.state.settings } employees={this.state.employees} dates={this.state.dates} schedules={this.state.schedules} onNewEmployee={this.handleOnNewEmployee} onScheduleChange={this.handleOnScheduleChange}/>
			</>
	    );
	}
}
