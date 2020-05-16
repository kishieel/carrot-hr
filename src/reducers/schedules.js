const schedulesReducer = (state = { "1:2020-01-02": { begin: "6:00", cease: "14:00", preference: true },"1:2020-01-03": { begin: "6:00", cease: "14:00", preference: true },"1:2020-01-04": { begin: "6:00", cease: "14:00", preference: true },"1:2020-01-05": { begin: "6:00", cease: "14:00", preference: true } }, action) => {
	switch (action.type) {
		case 'EDIT_SCHEDULE': {
			let schedule = { ...state[ action.schedule_id ] } || {};
			schedule[ action.property ] = action.value.toUpperCase()
			schedule[ "preference" ] = true

			if ( ( !schedule[ "begin" ] || schedule[ "begin" ] === "" ) &&
				( !schedule[ "cease" ] || schedule[ "cease" ] === "" ) ) {
				let { [ action.schedule_id ]: remove, ...res } = state
				return { ...res }
			}

			return {
				...state,
				[ action.schedule_id ]: schedule
			}
		}
		case 'PROCESS_SCHEDULE': {
			let schedule = { ...state[ action.schedule_id ] };
			if ( [1, 2, 3].includes( parseInt( action.value ) ) ) {
				schedule["begin"] = action.settings.shifts_time[`shift_${action.value}`].begin
				schedule["cease"] = action.settings.shifts_time[`shift_${action.value}`].cease
			}
			if ( action.value === "" ) {
				let { [ action.schedule_id ]: remove, ...res } = state
				return { ...res }
			}
			return {
				...state,
				[ action.schedule_id ]: schedule
			}
		}
		case 'SCHEDULE_GENERATE': {
			let res = {}
			for ( const date of action.dates ) {
				const availableEmployees = { ...action.employees }

				let schedulesShift1 = []
				let schedulesShift2 = []
				let schedulesShift3 = []

				Object.entries(state).filter( ([key, obj]) => {
					const [ emp_id, date_id ] = key.split(':')
					return date_id === date
				} ).map( ([key, obj]) => {
					const [ emp_id, date_id ] = key.split(":")
					delete availableEmployees[ emp_id ]
					if ( obj.begin === "6:00") schedulesShift1.push( { employee_id: parseInt(emp_id), ...obj })
					if ( obj.begin === "14:00") schedulesShift2.push( { employee_id: parseInt(emp_id), ...obj })
					if ( obj.begin === "22:00") schedulesShift3.push( { employee_id: parseInt(emp_id), ...obj })
					// return
				} )


				console.log( { schedulesShift1, schedulesShift2, schedulesShift3 } )
				for ( const schedule of schedulesShift1 ) {
					res[ `${schedule.employee_id}:${date}` ] = schedule
					delete res["employee_id"]
				}

				for ( const schedule of schedulesShift2 ) {
					res[ `${schedule.employee_id}:${date}` ] = schedule
					delete res["employee_id"]
				}

				for ( const schedule of schedulesShift3 ) {
					res[ `${schedule.employee_id}:${date}` ] = schedule
					delete res["employee_id"]
				}

				// Tu trzeba porozdzielac dostępnych pracowników na zmiany
			}
			return { ...res }
		}
		case 'CLEAR_SCHEDULE': {
			state = undefined
			return { ...state }
		}
		default:
			return state;
	}
};

export default schedulesReducer;
