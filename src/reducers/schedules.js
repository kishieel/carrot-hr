const schedulesReducer = (state = { }, action) => {
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
