// const initialState = {
// 	1: { signature: "Ada", time_contract: 1, role: "" },
// 	2: { signature: "Romek", time_contract: 1, role: "" },
// 	3: { signature: "Capek", time_contract: 1, role: "" },
// 	4: { signature: "Sebek", time_contract: 1, role: "" },
// 	5: { signature: "Kikek", time_contract: 1, role: "" },
// 	6: { signature: "Rike", time_contract: .75, role: "" },
// 	7: { signature: "Pike", time_contract: 1, role: "" },
// 	8: { signature: "Mike", time_contract: 1, role: "" },
// 	9: { signature: "Katarz", time_contract: 1, role: "" },
// 	10: { signature: "Saba", time_contract: 1, role: "" },
// 	11: { signature: "Zomas", time_contract: 1, role: "" },
// 	12: { signature: "Komas", time_contract: 1, role: "" },
// 	13: { signature: "Bilias", time_contract: 1, role: "" },
// }
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
