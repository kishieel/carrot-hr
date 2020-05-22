const initialState = {
	employeeSettings: {
		show: false,
		employeeId: 0
	},
	holidayDates: [
		"2020-01-01", "2020-01-06", "2020-04-12", "2020-04-13", "2020-05-01",
		"2020-05-03", "2020-05-31", "2020-06-11", "2020-08-15", "2020-11-01",
		"2020-11-11", "2020-12-25", "2020-12-26"
	]
}

const temporaryReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'EMPLOYEE_SETTINGS': {
			return {
				...state,
				employeeSettings: {
					...state.employeeSettings,
					show: action.show,
					employeeId: action.employeeId
				}
			}
		}
		default:
			return state
	}
}

export default temporaryReducer
