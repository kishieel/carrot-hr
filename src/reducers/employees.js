const initialState = {
	employeeNextId: 1,
	employeeList: {
		"1": "Masło"
	}
}

const employeesReducer = ( state = {}, action ) => {
	switch ( action.type ) {
		default:
			return state
	}
}

export default employeesReducer
