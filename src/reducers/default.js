import { SAVE, LOAD } from '../actions/default'

const defaultReducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case SAVE: {
			
			return state
		}
		case LOAD: {
			return state
		}
		default:
			return state
	}
}

export default defaultReducer
