console.log( [[1, "2020-04-01"], [2, "2020-04-01"]].includes( 1, "2020-04-01" ))

console.log( dupa )
console.log( [parseInt("1"), "2020-04-01"] )
console.log( dupa.every(dup => [parseInt("1"), "2020-04-01"].indexOf(dupe) > 0) )

let pipcioch = schedules_temp.filter(schedule => { return !( dupa.includes([parseInt(schedule.employee_id), schedule.date]) ) })

console.log("this.state.schedules", this.state.schedules)
console.log("przeslane do funkcji", p_schedules)
console.log("pipcioszki", pipcioch)

schedules_temp = schedules_temp.filter(schedule => { return !(
	schedule.employee_id == parseInt(p_schedule.employee_id) &&
	schedule.date == p_schedule.date
)});

console.log( p_schedules )
// console.log( p_schedule );


// ------------------------------------------------------------------------------------------

console.log(this.state.schedules)

console.log(employees_no_preferences);




const shift_0 = preferences.filter(preference => { return ( ![ "", "1", "2"].includes(preference.shift) ) } ).map(preference => ({ employee_id: parseInt( preference.employee_id ), shift: preference.shift }) );
const shift_1 = preferences.filter(preference => { return ( preference.shift == 1 ) } ).map(preference => ({ employee_id: parseInt( preference.employee_id ), shift: preference.shift }) );
const shift_2 = preferences.filter(preference => { return ( preference.shift == 2 ) } ).map(preference => ({ employee_id: parseInt( preference.employee_id ), shift: preference.shift }) );

console.log( "shift_0", shift_0 )
console.log( "shift_1", shift_1 )
console.log( "shift_2", shift_2 )

const no_shift = employees.filter(employee => { return employee.time > 0 });

for ( const s of shift_0 ) {

}

const shift_0 = select( no_shift, (employee => { return shift_0_preference.includes( parseInt(employee.id) ) } ) ).map( part => ({ employee_id: part.id, shift: "Huj wie co"  }) )
const shift_1 = select( no_shift, (employee => { return shift_1_preference.includes( parseInt(employee.id) ) } ) ).map( part => ({ employee_id: part.id, shift: 1 }) )
const shift_2 = select( no_shift, (employee => { return shift_2_preference.includes( parseInt(employee.id) ) } ) ).map( part => ({ employee_id: part.id, shift: 2 }) )

console.log( "no_shift", no_shift )
console.log( "shift_0", shift_0 )
console.log( "shift_1", shift_1 )
console.log( "shift_2", shift_2 )

let sp_1 = preferences.map( preference => parseInt(preference.employee_id) );
console.log(sp_1)
console.log( "selected" , select2( no_shift, (employee => { return sp_1.includes(parseInt(employee.id)) } ) ) )
console.log( "orgin", no_shift);

for ( const preference of preferences ) {
	if ( preference.shift == 1 ) {
		shift_1.push( select( no_shift, (employee => { return preference.employee_id == employee.id } ) ) )
	} else if ( preference.shift == 2 ) {
		shift_2.push( select( no_shift, (employee => { return preference.employee_id == employee.id } ) ) )
	} else if ( preference.shift != "") {
		shift_0.push( select( no_shift, (employee => { return preference.employee_id == employee.id } ) ) )
	}
}

console.log(preferences)
console.log(shift_0)
console.log(shift_1)
console.log(shift_2)

break;

for ( const employee of employees ) {
	let shift_preference = document.querySelector('input[data-employee-id="' + employee.id + '"][data-date-id="' + date + '"]').value;
	if ( shift_preference ) {
		date_preferences.push({ employee_id: employee.id, date: date, shift: shift_preference, preference: true });
	}
}
console.log(date_preferences)
