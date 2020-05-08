import { createStore, combineReducers } from 'redux';
import defaultReducer from '../reducers/default'
import schedulesReducer from '../reducers/schedules'
import settingsReducer from '../reducers/settings'
import employeesReducer from '../reducers/employees'
import datesReducer from '../reducers/dates'

const reducer = (state = {}, action) => {
  	return {
		default: defaultReducer(state, action),
		settings: settingsReducer(state.settings, action),
		schedules: schedulesReducer(state.schedules, action),
		employees: employeesReducer(state.employees, action),
		dates: datesReducer(state.dates, action),
	};
};
// const reducer = combineReducers({
// 	schedules: schedulesReducer,
// 	navigationReducer,
// 	settings: settingsReducer,
// })

const store = createStore(reducer);

export default store;
