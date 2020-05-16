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
			let employee = state[ action.id ];
			employee[ action.field ] = action.value;

			return {
				...state,
				[ action.id ]: employee
			}
		}
		case 'EMPLOYEE_REMOVE': {
			let { [ action.employee_id ]: remove, ...res } = state;
			return { ...res };
		}
		default:
			return state;
	}
};

export default employeesReducer;
