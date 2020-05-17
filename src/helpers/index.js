const moment = require('moment')

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const PL_DAYS_FULL = { mon: "Poniedziałek", tue: "Wtorek", wed: "Środa", thu: "Czwartek", fri: "Piatek", sat: "Sobota", sun: "Niedziela"};
export const getDayName = ( en ) => {
	return PL_DAYS_FULL[ en ];
}

const PL_DAYS_SHORT = { mon: "PN", tue: "WT", wed: "ŚR", thu: "CZ", fri: "PT", sat: "SB", sun: "ND" };
export const getDayShortName = ( en ) => {
	return PL_DAYS_SHORT[ en ];
}

let datesFromPeriodCache = {}
export const getDatesFromPeriod = ( period, type ) => {
	let cacheId = `${type}:${period}`
	if ( datesFromPeriodCache[cacheId] !== undefined ) {
		return datesFromPeriodCache[cacheId]
	}

	let dates = [];

	if ( type === "QUARTER" ) {
		for (let m = moment( period ); m.isBefore( moment( period ).add(1, 'quarter') ); m.add(1, 'days')) {
		  	dates.push( m.format("YYYY-MM-DD") );
		}
	} else {
		for (let m = moment( period ); m.isBefore( moment( period ).add(1, 'month') ); m.add(1, 'days')) {
		  	dates.push( m.format("YYYY-MM-DD") );
		}
	}

	datesFromPeriodCache[cacheId] = dates

	return dates;
}

export const chunk = (arr, size) => Array.from(
	{ length: Math.ceil(arr.length / size) },
	(v, i) => arr.slice(i * size, i * size + size)
);

const MONTHS_NAME = { 1: "Styczeń", 2: "Luty",  3: "Marzec",  4: "Kwiecień",  5: "Maj",  6: "Czerwiec",  7: "Lipiec",  8: "Sierpień",  9: "Wrzesień", 10: "Październik", 11: "Listopad",  12: "Grudzień" }
export const getMonthName = ( date ) => {
	let m = moment(date);
	return `${ MONTHS_NAME[ m.format("M") ] } ${m.format("YYYY")}`
}


const QUARTERS_NAME = { 1: "I kwartał", 2: "II kwartał", 3: "III kwartał", 4: "IV kwartał" }
export const getQuarterName = ( date ) => {
	let m = moment(date);
	return `${ QUARTERS_NAME[ m.format("Q") ] } ${m.format("YYYY")}`
}

export const isTimeFormatValid = ( time ) => {
	let reg = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
	return reg.test(time);
}

export const isShiftValid = ( value, free_days ) => {
	let shifts = ["1", "2", "3", "W", "WS", "ZZ", "DU", "UW", "NP", "UO"];
	Object.entries(free_days).map(([key, obj]) => {
		if ( obj !== null ) shifts.push( obj.index )
	})
	return shifts.includes( value )
}

let timeBaseCache = {}
export const calculateTimeBase = ( period, type, free_days ) => {
	let cacheId = `${type}:${period}:${ Object.entries(free_days).filter(([key, obj]) => { return ( obj !== null ) }).map(([key, obj]) => { return key }).join('-') }`
	if ( timeBaseCache[cacheId] !== undefined ) {
		return timeBaseCache[cacheId]
	}

	let time = 0
	let dates = getDatesFromPeriod( period, type )

	for ( const date of dates ) {
		let free_day = free_days[ moment(date).format("ddd").toLowerCase() ] || null
		// let holiday = holidays[ date ] || null
		// Tymczasowe.. trzeba dorobic generator
		if ( free_day === null && !["2020-01-01", "2020-01-06", "2020-04-12", "2020-04-13", "2020-05-01", "2020-05-03", "2020-05-31", "2020-06-11", "2020-08-15", "2020-11-01", "2020-11-11", "2020-12-25", "2020-12-26"].includes(date) ) time += 8
	}

	timeBaseCache[cacheId] = time

	return time;
}

export const workTimeSelector = (schedules, employee_id, forecePreference = false ) => {
	let work_time = 0
	Object.entries(schedules).filter( ([key, obj]) => {
		let [ emp_id, date_id ] = key.split(":")
		return ( parseInt( emp_id ) === parseInt( employee_id ) && ( !forecePreference || obj.preference === true ));
	}).map(([key, obj]) => {
		if ( isTimeFormatValid( obj.begin ) === true && isTimeFormatValid( obj.cease ) === true ) {
			let [ emp_id, date_id ] = key.split(":")
			let beginDate = moment(`${date_id} ${obj.begin}`)
			let ceaseDate = moment(`${date_id} ${obj.cease}`)

			let diff = ceaseDate.diff( beginDate, 'hours', true )
			if ( diff < 0 ) diff += 24
			work_time += diff
		}
		if ( ["ZZ", "UW", "DU", "NP", "UO"].includes( obj.begin ) ) work_time += 8
	})
	return work_time;
}
