import { UPDATE_SCHEDULE } from '../actions/schedules'

const schedulesReducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case UPDATE_SCHEDULE: {
			console.log(state)
			return {
				...state,
				[ action.scheduleId ]: {
					...state[ action.scheduleId ],
					[ action.field ]: action.value,
					preference: true,
				}
			}
		}
		default:
			return state
	}
}

export default schedulesReducer
