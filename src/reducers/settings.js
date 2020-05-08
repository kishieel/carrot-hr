import { DAYS } from '../helpers'

const initialState = {
	is_absences_layer: false,
	is_time_layer: false,
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
		sun: {
			shift_1: 0,
			shift_2: 0,
		},
		mon: {
			shift_1: 5,
			shift_2: 5,
		},
		tue: {
			shift_1: 4,
			shift_2: 4,
		},
		wed: {
			shift_1: 5,
			shift_2: 4,
		},
		thu: {
			shift_1: 4,
			shift_2: 4,
		},
		fri: {
			shift_1: 4,
			shift_2: 4,
		},
		sat: {
			shift_1: 5,
			shift_2: 4,
		},
	}
}

const settingsReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'DAILY_TIME': {
			return { ...state, daily_time: action.value }
		}
		case 'DAILY_TIME': {
			return { ...state, daily_break: action.value }
		}
		case 'DAILY_TIME': {
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
		case 'ABSENCES': {
			state.is_absences_layer = ! state.is_absences_layer
			state.is_time_layer = false
			return { ...state }
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
