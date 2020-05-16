const schedulesReducer = (state = { "1:2020-01-02": { begin: "6:00", cease: "14:00", preference: true },"1:2020-01-03": { begin: "6:00", cease: "14:00", preference: true },"1:2020-01-04": { begin: "6:00", cease: "14:00", preference: true },"1:2020-01-05": { begin: "6:00", cease: "14:00", preference: true } }, action) => {
	switch (action.type) {
		case 'EDIT_SCHEDULE': {
			let schedule = { ...state[ action.schedule_id ] } || {};
			schedule[ action.property ] = action.value.toUpperCase()
			schedule[ "preference" ] = true

			if ( ( !schedule[ "begin" ] || schedule[ "begin" ] === "" ) &&
				( !schedule[ "cease" ] || schedule[ "cease" ] === "" ) ) {
				let { [ action.schedule_id ]: remove, ...res } = state
				return { ...res }
			}

			return {
				...state,
				[ action.schedule_id ]: schedule
			}
		}
		case 'CLEAR_SCHEDULE': {
			state = undefined
			return { ...state }
		}
		default:
			return state;
	}
};

export default schedulesReducer;
