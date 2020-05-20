import { DAYS } from '../helpers'

const initialState = {
	is_absences_layer: false,
	is_time_layer: false,
	billing_period_type: "QUARTER",
	billing_period: "2020-04", /* 2020-01 */
	daily_time: "12:00",
	daily_break: "13:00",
	weekly_break: "35:00",
	free_days: {
		mon: null,
		tue: null,
		wed: null,
		thu: null,
		fri: null,
		sat: { index: "SB", permanent: false},
		sun: { index: "ND", permanent: true},
	},
	shifts_crew: {
		sun: { shift_1: 0, shift_2: 0, shift_3: 0 },
		mon: { shift_1: 5, shift_2: 5, shift_3: 0 },
		tue: { shift_1: 4, shift_2: 4, shift_3: 0 },
		wed: { shift_1: 5, shift_2: 5, shift_3: 0 },
		thu: { shift_1: 4, shift_2: 4, shift_3: 0 },
		fri: { shift_1: 4, shift_2: 5, shift_3: 0 },
		sat: { shift_1: 5, shift_2: 5, shift_3: 0 },
	},
	shifts_time: {
		shift_1: { begin: "6:00", cease: "14:30" },
		shift_2: { begin: "14:00", cease: "22:30" },
		shift_3: { begin: "22:00", cease: "6:30" },
	}
}

const settingsReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'DAILY_TIME': {
			return { ...state, daily_time: action.value }
		}
		case 'DAILY_BREAK': {
			return { ...state, daily_break: action.value }
		}
		case 'WEEKLY_BREAK': {
			return { ...state, weekly_break: action.value }
		}
		case 'FREE_DAYS': {
			let free_days = state.free_days;
			if ( DAYS.includes(action.key) ) {
				if ( action.value === true ) {
					free_days[ action.key ] = { index: `${action.key.toUpperCase()}`, permanent: true };
				} else {
					free_days[ action.key ] = null;
				}
			}
			return { ...state, free_days }
		}
		case 'FREE_DAYS_INDEX': {
			let free_days = state.free_days;
			if ( DAYS.includes(action.key) ) {
				free_days[ action.key ].index = action.value;
			}
			return { ...state, free_days }
		}
		case 'FREE_DAYS_PERMANENT': {
			let free_days = state.free_days;
			if ( DAYS.includes(action.key) ) {
				free_days[ action.key ].permanent = action.value;
			}
			return { ...state, free_days }
		}
		case 'SHIFTS_CREW': {
			let shifts_crew = state.shifts_crew;
			if ( DAYS.includes(action.key) ) {
				shifts_crew[ action.key ][ action.shift ] = action.value;
			}
			return { ...state, shifts_crew }
		}
		case 'SHIFTS_TIME': {
			let shifts_time = state.shifts_time;
			shifts_time[ action.key ][ action.property ] = action.value;
			return { ...state, shifts_time }
		}
		case 'ABSENCES': {
			state.is_absences_layer = ! state.is_absences_layer
			state.is_time_layer = false
			return { ...state }
		}
		case 'BILLING_PERIOD_TYPE': {
			return { ...state, billing_period_type: action.value }
		}
		case 'BILLING_PERIOD': {
			return { ...state, billing_period: action.value }
		}
		case 'WORK_TIME': {
			state.is_absences_layer = false
			state.is_time_layer = ! state.is_time_layer
			return { ...state }
		}
		default:
			return state
	}
}

export default settingsReducer;
