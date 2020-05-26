import { calculateTimeBase, workTimeSelector, isTimeFormatValid } from '../helpers'

const moment = require('moment')

const getMostBored = ( employees ) => {
	if ( Object.keys(employees).length === 0 ) return;
	let mostBored = employees[ Object.keys(employees)[0] ]
	Object.entries( employees ).map( ([key, obj]) => {
		console.log()
		if ( mostBored.time_left / mostBored.time_contract < obj.time_left / obj.time_contract ) {
			mostBored = obj;
		}
	})
	return mostBored
}

const fillShift = ( shift, minCrew, availableEmployees, employees, date, begin, cease ) => {
	while ( shift.length < minCrew ) {
		if ( Object.keys( availableEmployees ).length === 0 ) break

		let employee = getMostBored( availableEmployees )
		employees[ employee.id ].time_left -= 8.5

		delete availableEmployees[ employee.id ]
		shift.push({ employee_id: employee.id, date: date, begin: begin, cease: cease, preference: false })
	}
}

const pushShiftToSchedules = ( schedules, shift ) => {
	for ( const schedule of shift ) {
		let { employeeId, ...scheduleSection } = schedule
		schedules[ `${schedule.employee_id}:${schedule.date}` ] = scheduleSection
	}
}

// "1:2020-04-02": { begin: "6:00", cease: "14:00", preference: true },"1:2020-04-03": { begin: "6:00", cease: "14:00", preference: true },"1:2020-04-04": { begin: "6:00", cease: "14:00", preference: true },"1:2020-04-05": { begin: "6:00", cease: "14:00", preference: true }
const schedulesReducer = (state = {  }, action) => {
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
		case 'SCHEDULE_GENERATE': { // To to wgl nie patrzy czy preferencja czy nie.. przy liczeniu czasu trzeba zliczac tylko ten dla preferencji na start i potem przy rozdzieleniu na shifty trzeba sprawdzać tylko te co mają preference
			let res = {}
			let employees = {}

			Object.entries(action.employees).map(([key, obj]) => {
				let time_left = calculateTimeBase( action.settings.billing_period, action.settings.billing_period_type, action.settings.free_days ) * obj.time_contract
				const work_time = workTimeSelector(state, key, true)

				time_left -= work_time
				employees[key] = { id: key, time_left: time_left, ...obj }
			})

			for ( const date of action.dates ) {
				const availableEmployees = { ...employees }

				let schedulesShift1 = []
				let schedulesShift2 = []
				let schedulesShift3 = []

				let schedulesShift1Managers = 0
				let schedulesShift2Managers = 0
				let schedulesShift3Managers = 0

				Object.entries(state).filter( ([key, obj]) => {
					const [ emp_id, date_id ] = key.split(':')
					return ( date_id === date && obj.preference === true )
				} ).map( ([key, obj]) => {
					const [ emp_id, date_id ] = key.split(":")
					delete availableEmployees[ emp_id ]
					if ( obj.begin === "6:00") {
						schedulesShift1.push( { employee_id: emp_id, date: date, ...obj })
						if ( employees[ emp_id ]?.role === "KIEROWNIK" ) {
							schedulesShift1Managers += 1
						}
					} else if ( obj.begin === "14:00") {
						schedulesShift2.push( { employee_id: emp_id, date: date, ...obj })
						if ( employees[ emp_id ]?.role === "KIEROWNIK" ) {
							schedulesShift2Managers += 1
						}
					} else if ( obj.begin === "22:00") {
						schedulesShift3.push( { employee_id: emp_id, date: date, ...obj })
						if ( employees[ emp_id ]?.role === "KIEROWNIK" ) {
							schedulesShift3Managers += 1
						}
					} else {
						res[ key ] = obj
					}
				} )

				Object.entries( employees ).map( ([key, obj]) => {
					if ( obj.time_left <= 0 ) delete availableEmployees[key]
				})

				let minCrewOfShift1 = action.settings.shifts_crew[ moment(date).format("ddd").toLowerCase() ].shift_1
				let timeOfShift1 = action.settings.shifts_time.shift_1
				let minCrewOfShift2 = action.settings.shifts_crew[ moment(date).format("ddd").toLowerCase() ].shift_2
				let timeOfShift2 = action.settings.shifts_time.shift_2
				let minCrewOfShift3 = action.settings.shifts_crew[ moment(date).format("ddd").toLowerCase() ].shift_3
				let timeOfShift3 = action.settings.shifts_time.shift_3

				let availableManagers = { }
				Object.entries( availableEmployees ).map( ([key, obj]) => {
					if ( obj.role === "KIEROWNIK") {
						availableManagers[ key ] = obj
						delete availableEmployees[ key ]
					}
				} )

				if ( schedulesShift1Managers === 0 && schedulesShift1.length < minCrewOfShift1 ) {
					if ( Object.keys( availableManagers ).length > 0 ) {
						let employee = getMostBored( availableManagers )
						employees[ employee.id ].time_left -= 8.5

						delete availableManagers[ employee.id ]
						schedulesShift1.push({ employee_id: employee.id, date: date, begin: timeOfShift1.begin, cease: timeOfShift1.cease, preference: true })

						schedulesShift1Managers += 1
					}
				}

				if ( schedulesShift2Managers === 0 && schedulesShift2.length < minCrewOfShift2 ) {
					if ( Object.keys( availableManagers ).length > 0 ) {
						let employee = getMostBored( availableManagers )
						employees[ employee.id ].time_left -= 8.5

						delete availableManagers[ employee.id ]
						schedulesShift2.push({ employee_id: employee.id, date: date, begin: timeOfShift2.begin, cease: timeOfShift2.cease, preference: true })

						schedulesShift2Managers += 1
					}
				}

				if ( schedulesShift3Managers === 0 && schedulesShift3.length < minCrewOfShift3 ) {
					if ( Object.keys( availableManagers ).length > 0 ) {
						let employee = getMostBored( availableManagers )
						employees[ employee.id ].time_left -= 8.5

						delete availableManagers[ employee.id ]
						schedulesShift3.push({ employee_id: employee.id, date: date, begin: timeOfShift3.begin, cease: timeOfShift3.cease, preference: true })

						schedulesShift3Managers += 1
					}
				}

				Object.entries( availableManagers ).map( ([key, obj]) => {
					availableEmployees[ key ] = obj
				} )

				fillShift( schedulesShift1, minCrewOfShift1, availableEmployees, employees, date, timeOfShift1.begin, timeOfShift1.cease )
				fillShift( schedulesShift2, minCrewOfShift2, availableEmployees, employees, date, timeOfShift2.begin, timeOfShift2.cease )
				fillShift( schedulesShift3, minCrewOfShift3, availableEmployees, employees, date, timeOfShift3.begin, timeOfShift3.cease )

				pushShiftToSchedules( res, schedulesShift1 )
				pushShiftToSchedules( res, schedulesShift2 )
				pushShiftToSchedules( res, schedulesShift3 )

				Object.entries( availableEmployees ).map( ([key, obj]) => {
					res[ `${obj.id}:${date}` ] = { begin: "W" }
				})
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
