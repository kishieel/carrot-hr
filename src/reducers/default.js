import { SAVE, LOAD } from '../actions/default'

const moment = require('moment')

const defaultReducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case SAVE: {
			const saveable = ( ({ employees, schedules, settings }) => ({ employees, schedules, settings }) )(state)
			const file = new Blob( [ JSON.stringify( saveable ) ], { type: 'application/json' } ) || null;

			const element = document.createElement("a");
			element.href = URL.createObjectURL( file );
			element.download = moment().format("YYYY-MM-DD HH:mm:ss") || "CarrotHR - ZAPIS";
			document.body.appendChild(element);
			element.click();

			return state
		}
		case LOAD: {
			const { employees, settings, schedules } = action.payload
			state.employees = employees
			return { ...state }
		}
		default:
			return state
	}
}

export default defaultReducer
