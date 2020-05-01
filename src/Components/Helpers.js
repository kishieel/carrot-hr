// Returns the name of the day based on a date
const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export const getDayName = (date) => {
	let dt = new Date(date);
	return days[dt.getDay()];
}

const days_PL = ["ND", "PN", "WT", "ŚR", "CZ", "PT", "SB"];
export const getPolishDayName = (date) => {
	let dt = new Date(date);
	return days_PL[dt.getDay()];
}

export const timeValidator = (time) => {
	let reg = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
	return reg.test(time);
}

export const shiftValidator = (shift) => {
	let shifts = ["1", "2", "3", "W", "WS", "PN", "WT", "ŚR", "CZ", "PT", "SB", "ND"];
	return shifts.includes(shift)
}


// Working same as Array.prototype.filter, but it's cut filtered elements from orginal array if they satisfy condition in predication
export const select = (arr, predicate) => {
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
export const chunk = (arr, size) => Array.from(
	{ length: Math.ceil(arr.length / size) },
	(v, i) => arr.slice(i * size, i * size + size)
);

export const wodge = (arr, size, more) => Array.from(
  { length: Math.ceil(arr.length / size) },
  (v, i) => arr.slice(i * size, i * size + size + more )
);

// Copies arrays without any references
export const duplicate = (arr) => { return JSON.parse(JSON.stringify(arr)) };
