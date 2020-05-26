import { UPDATE_SCHEDULE } from '../actions/schedules'
import { REMOVE_EMPLOYEE } from '../actions/employees'


const schedulesReducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case UPDATE_SCHEDULE: {
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
		case REMOVE_EMPLOYEE: {
			const { [ action.employeeId ]: _, ...schedules } = state

			return schedules
		}
		default:
			return state
	}
}

export default schedulesReducer
