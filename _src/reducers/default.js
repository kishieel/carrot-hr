const moment = require('moment')

const defaultReducer = ( state = {}, action, root) => {
	switch( action.type ) {
		case 'SAVE': {
			const file = new Blob( [ JSON.stringify( root ) ], { type: 'application/json' } ) || null;

			const element = document.createElement("a");
			element.href = URL.createObjectURL( file );
			element.download = moment().format("YYYY-MM-DD HH:mm:ss") || "CarrotHR - ZAPIS";
			document.body.appendChild(element);
			element.click();

			return { ...state }
		}
		case 'LOADED': {
			let obj = action.payload;
			root.settings = obj.settings;
			root.schedules = obj.schedules;
			root.employees = obj.employees;

			return { ...state }
		}
		default:
			return state
	}
}

export default defaultReducer;
