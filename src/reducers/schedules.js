const schedulesReducer = (state = { }, action) => {
	switch (action.type) {
		case 'EDIT_SCHEDULE': {
			let schedule = { ...state[ action.schedule_id ] } || {};
			schedule[ action.property ] = action.value
			schedule[ "preference" ] = true

			// jezeli begin i cease puste usun schedula

			return {
				...state,
				[ action.schedule_id ]: schedule
			}
		}
		case 'CLEAR_SCHEDULE': {
			return { ...state }
		}
		default:
			return state;
	}
};

export default schedulesReducer;
