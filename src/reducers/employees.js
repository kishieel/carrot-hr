import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE } from '../actions/employees'

const initialState = {
	employeeNextId: 1,
	employeeList: { }
}

const employeesReducer = ( state = initialState, action ) => {
	switch ( action.type ) {
		case CREATE_EMPLOYEE: {
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
		case UPDATE_EMPLOYEE: {
			return {
				...state,
				employeeList: {
					...state.employeeList,
					[ action.employeeId ]: {
						...state.employeeList[ action.employeeId ],
						[ action.field ]: action.value
					}
				}
			}
		}
		default:
			return state
	}
}

export default employeesReducer
