import {
	UPDATE_SETTINGS,
	UPDATE_BILLING_TYPE,
	SET_FREE_DAYS,
	UPDATE_FREE_DAYS,
	UPDATE_SHIFT_TIMES,
	UPDATE_SHIFT_CREW
} from '../actions/settings'

const moment = require("moment")

const initialState = {
	billingType: "MONTH",
	billingPeriod: moment().format("YYYY-MM"),
	maxWorkTime: "13:00",
	minDailyBreak: "11:00",
	minWeeklyBreak: "35:00",
	shiftsCount: 2,
	freeDays: {
		mon: null,
		tue: null,
		wed: null,
		thu: null,
		fri: null,
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
		case UPDATE_SETTINGS: {
			return {
				...state,
				[ action.field ]: action.value
			}
		}
	 	case UPDATE_BILLING_TYPE: {
			let billingPeriod = moment( moment( state.billingPeriod ).format("YYYY-01 Q"), "YYYY-01 Q" ).format("YYYY-MM")

			return {
				...state,
				billingType: action.billingType,
				billingPeriod
			}
	 	}
		case SET_FREE_DAYS: {
			if ( action.checked === false ) {
				return {
					...state,
					freeDays: {
						...state.freeDays,
						[ action.day ] : null
					}
				}
			}

			return {
				...state,
				freeDays: {
					...state.freeDays,
					[ action.day ] : {
						index: moment().day( action.day ).locale('pl').format('dd').toUpperCase(),
						permanent: true
					}
				}
			}
		}
		case UPDATE_FREE_DAYS: {
			return {
				...state,
				freeDays: {
					...state.freeDays,
					[ action.day ]: {
						...state.freeDays[ action.day ],
						[ action.field ]: action.value
					}
				}
			}
		}
		case UPDATE_SHIFT_TIMES: {
			return {
				...state,
				shiftTimes: {
					...state.shiftTimes,
					[ action.shiftNumber ]: {
						...state.shiftTimes[ action.shiftNumber ],
						[ action.field ]: action.value
					}
				}
			}
		}
		case UPDATE_SHIFT_CREW: {
			return {
				...state,
				shiftCrew: {
					...state.shiftCrew,
					[ action.day ]: {
						...state.shiftCrew[ action.day ],
						[ action.field ]: action.value
					}
				}
			}
		}
		default:
			return state
	}
}

export default settingsReducer
