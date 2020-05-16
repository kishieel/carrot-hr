import { createStore } from 'redux';
import defaultReducer from '../reducers/default'
import schedulesReducer from '../reducers/schedules'
import settingsReducer from '../reducers/settings'
import employeesReducer from '../reducers/employees'

const reducer = (state = {}, action) => {
  	return {
		default: defaultReducer(state.default, action, state),
		settings: settingsReducer(state.settings, action),
		schedules: schedulesReducer(state.schedules, action),
		employees: employeesReducer(state.employees, action),
	};
};

const store = createStore(reducer);

export default store;