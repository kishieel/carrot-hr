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
