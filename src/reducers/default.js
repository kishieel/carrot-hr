const moment = require('moment')

const defaultReducer = ( root, action) => {
	switch( action.type ) {
		case 'SAVE': {
			const file = new Blob( [ JSON.stringify( root ) ], { type: 'application/json' } ) || null;

			const element = document.createElement("a");
			element.href = URL.createObjectURL( file );
			element.download = moment().format("YYYY-MM-DD HH:mm:ss") || "CarrotHR - ZAPIS";
			document.body.appendChild(element);
			element.click();

			return { ...root }
		}
		case 'LOADED': {
			let obj = action.payload;
			root.settings = obj.settings;
			root.schedules = obj.schedules;
			root.employees = obj.employees;

			return { ...root }
		}
		default:
			return root
	}
}

export default defaultReducer;
