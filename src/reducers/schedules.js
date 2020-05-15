const initialSchedule = {
	begin: "",
	cease: "",
	preference: true
}

const schedulesReducer = (state = { }, action) => {
	switch (action.type) {
		case 'EDIT_SCHEDULE': {
			let schedule = { ...state[ action.schedule_id ] } || { ...initialSchedule };
			schedule[ action.property ] = action.value

			console.log(action, state, schedule)

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
