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

export const isShiftValid = ( value ) => {
	let shifts = ["1", "2", "3", "W", "WS", "PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"];
	return shifts.includes( value )
}
