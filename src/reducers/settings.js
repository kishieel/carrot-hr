import {
	UPDATE_SETTINGS,
	UPDATE_BILLING_TYPE,
	SET_FREE_DAYS,
	UPDATE_FREE_DAYS,
	CREATE_SHIFT,
	UPDATE_SHIFT,
	REMOVE_SHIFT,
	UPDATE_SHIFT_CREW
} from '../actions/settings'

const moment = require("moment")

const initialState = {
	billingType: "MONTH",
	billingPeriod: moment().format("YYYY-MM"),
	maxWorkTime: "13:00",
	minDailyBreak: "11:00",
	minWeeklyBreak: "35:00",
	freeDays: {
		mon: null,
		tue: null,
		wed: null,
		thu: null,
		fri: null,
		sat: { index: "SB", permanent: false },
		sun: { index: "ND", permanent: true }
	},
	shiftList: {
		[ 1 ]: {
			name: "Zmiana 1",
			index: "Z1",
			begin: "6:00",
			cease: "14:30",
			requireManager: true,
			crew: {
				mon: 5,
				tue: 4,
				wed: 5,
				thu: 4,
				fri: 4,
				sat: 5,
				sun: 0,
			}
		},
		[ 2 ]: {
			name: "Zmiana 2",
			index: "Z2",
			begin: "14:00",
			cease: "22:30",
			requireManager: true,
			crew: {
				mon: 5,
				tue: 4,
				wed: 5,
				thu: 4,
				fri: 5,
				sat: 5,
				sun: 0,
			}
		}
	},
	shiftNextId: 3
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
		case CREATE_SHIFT: {
			return {
				...state,
				shiftList: {
					...state.shiftList,
					[ state.shiftNextId ]: {
						name: action.name,
						index: "Z" + state.shiftNextId,
						begin: "0:00",
						cease: "0:00",
						isManagerRequire: false,
						crew: {
							mon: 0,
							tue: 0,
							wed: 0,
							thu: 0,
							fri: 0,
							sat: 0,
							sun: 0,
						}
					}
				},
				shiftNextId: state.shiftNextId + 1
			}
		}
		case UPDATE_SHIFT: {
			return {
				...state,
				shiftList: {
					...state.shiftList,
					[ action.shiftId ]: {
						...state.shiftList[ action.shiftId ],
						[ action.field ]: action.value
					}
				}
			}
		}
		case REMOVE_SHIFT: {
			const { [ action.shiftId ]: _, ...shiftList } = state.shiftList

			return {
				...state,
				shiftList
			}
		}
		case UPDATE_SHIFT_CREW: {
			return {
				...state,
				shiftList: {
					...state.shiftList,
					[ action.shiftId ]: {
						...state.shiftList[ action.shiftId ],
						crew: {
							...state.shiftList[ action.shiftId ].crew,
							[ action.dayName ]: action.value
						}
					}
				}
			}
		}
		default:
			return state
	}
}

export default settingsReducer
