import {
	UPDATE_SCHEDULE_ON_CHANGE,
	UPDATE_SCHEDULE_ON_BLUR,
	CLEAR_SCHEDULES
} from '../actions/schedules'
import { REMOVE_EMPLOYEE } from '../actions/employees'

const schedulesReducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case UPDATE_SCHEDULE_ON_CHANGE: {
			return {
				...state,
				[ action.employeeId ]: {
					...state[ action.employeeId ],
					[ action.date ]: {
						...state[ action.employeeId ]?.[ action.date ],
						[ action.field ]: action.value,
						preference: true,
						date: action.date,
						employeeId: action.employeeId
					}
				}
			}
		}
		case UPDATE_SCHEDULE_ON_BLUR: {
			if ( action.field === "begin" && Object.keys( action.shiftIndexes ).includes( action.value ) ) {
				return {
					...state,
					[ action.employeeId ]: {
						...state[ action.employeeId ],
						[ action.date ]: {
							...state[ action.employeeId ]?.[ action.date ],
							begin: action.shiftIndexes[ action.value ].begin,
							cease: action.shiftIndexes[ action.value ].cease,
						}
					}
				}
			}

			if ( action.field === "begin" && action.value === "" ) {
				const { [ action.employeeId ]: { [ action.date ]: _, ...employeeSchedules } = {}, ...schedules } = state

				return {
					...schedules,
					[ action.employeeId ]: {
						...employeeSchedules
					}
				}

			}

			return state
		}
		case CLEAR_SCHEDULES: {
			return { }
		}
		case REMOVE_EMPLOYEE: {
			const { [ action.employeeId ]: _, ...schedules } = state

			return schedules
		}
		default:
			return state
	}
}

export default schedulesReducer
