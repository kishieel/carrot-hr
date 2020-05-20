const initialState = {
	employeeNextId: 1,
	employeeList: { }
}

const employeesReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case 'CREATE_EMPLOYEE': {
			return {
				...state,
				employeeList: {
					...state.employeeList,
					[ state.employeeNextId ]: {
						signature: action.signature,
						timeContract: 1,
						role: "PRACOWNIK"
					}
				},
				employeeNextId: state.employeeNextId + 1
			}
		}
		default:
			return state
	}
}

export default employeesReducer
