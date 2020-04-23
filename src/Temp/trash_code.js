if ( this.state.settings.free_days[getDayName(date)] && this.state.settings.free_days[getDayName(date)].permanent ) {
	for ( const employee of employees ) {
		let schedule = { employee_id: employee.id, date: date, shift: this.state.settings.free_days[getDayName(date)].shift, preference: false }

		let schedules_temp = [ ...this.state.schedules ]
		schedules_temp = schedules_temp.filter(schedule => { return !(
			schedule.employee_id == employee.id &&
			schedule.date == date
		)});

		console.log(schedule)

		this.setState( { schedules: [ ...schedules_temp, schedule ] } )
	}
}

// Definitywnie trzeba zrobić tak, żeby mogło zwrócić wiele elementów :3
const select = (arr, predicate) => {
	if (arr == null) {
		throw new TypeError('Array.prototype.find called on null or undefined');
	}
	if (typeof predicate !== 'function') {
		throw new TypeError('predicate must be a function');
	}
	var list = Object(arr);
	var length = list.length >>> 0;
	var thisArg = arr[0];
	var value;
	var selected = [];

	for (var i = 0; i < length; i++) {
		value = list[i];
		if (predicate.call(thisArg, value, i, list)) {
	 		let i = list.indexOf(value)
			selected.push( list.splice(i, 1) );
			// return value; // tą wartośc pewnie pasowało by pewnie wrzucić do jakiejś tablicy poprostu :3
		}
	}
	return selected;
	// return undefined;
};
