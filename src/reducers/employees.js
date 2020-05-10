const initialState = { }
let next_employee_id = 1;

const employeesReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'EMPLOYEE_CREATE': {
			return {
				...state,
				[ next_employee_id++ ]: {
					signature: action.value,
					time_contract: 1,
					role: 'PRACOWNIK'
				}
			}
		}
		case 'EMPLOYEE_UPDATE': {
			return {
				...state,
				[ action.id ] : {
					...state[ action.id ],
					[ action.field ]: action.value
				}
			}
		}
		default:
			return state;
	}
};

export default employeesReducer;
