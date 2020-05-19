const moment = require("moment")

const initialState = {
	billingType: "MONTH",
	billingPeriod: moment().format("YYYY-MM"),
	maxWorkTime: "13:00",
	minDailyBreak: "11:00",
	minWeeklyBreak: "35:00",
	freeDays: {
		sat: { index: "SB", permanent: false },
		sun: { index: "ND", permanent: true }
	},
	shiftCrew: {
		mon: { "1": 5, "2": 5, "3": 0 },
		tue: { "1": 4, "2": 4, "3": 0 },
		wed: { "1": 5, "2": 5, "3": 0 },
		thu: { "1": 4, "2": 4, "3": 0 },
		fri: { "1": 4, "2": 5, "3": 0 },
		sat: { "1": 5, "2": 5, "3": 0 },
		sun: { "1": 0, "2": 0, "3": 0 },
	},
	shiftTimes: {
		"1": { begin: "6:00", cease: "14:30" },
		"2": { begin: "14:00", cease: "22:30" },
		"3": { begin: "22:00", cease: "6:30" },
	}
}

const settingsReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		default:
			return state
	}
}

export default settingsReducer
