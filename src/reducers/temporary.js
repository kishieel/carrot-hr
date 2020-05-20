const moment = require("moment")

const initialState = {
	employeeSettings: {
		show: false,
		employeeId: 0
	}
}

const temporaryReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'EMPLOYEE_SETTINGS': {
			console.log(action,state)
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
