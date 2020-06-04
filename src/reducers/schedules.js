import {
	UPDATE_SCHEDULE_ON_CHANGE,
	UPDATE_SCHEDULE_ON_BLUR,
	GENERATE_SCHEDULES,
	CLEAR_SCHEDULES
} from '../actions/schedules'
import { REMOVE_EMPLOYEE } from '../actions/employees'
import {
	TIME_FORMAT,
	parseSchedule,
	selectWorkTimeStateRaw,
	selectFreeDaysStateRaw
} from '../selectors/schedules'

const moment = require('moment')

const schedulesReducer = ( state = {}, action ) => {
	switch ( action.type ) {
		case UPDATE_SCHEDULE_ON_CHANGE: {
			return {
				...state,
				[ action.employeeId ]: {
					...state[ action.employeeId ],
					[ action.date ]: {
						...state[ action.employeeId ]?.[ action.date ],
						[ action.field ]: action.value,
						preference: true,
						date: action.date,
						employeeId: action.employeeId
					}
				}
			}
		}
		case UPDATE_SCHEDULE_ON_BLUR: {
			if ( action.field === "begin" && Object.keys( action.shiftIndexes ).includes( action.value ) ) {
				return {
					...state,
					[ action.employeeId ]: {
						...state[ action.employeeId ],
						[ action.date ]: {
							...state[ action.employeeId ]?.[ action.date ],
							begin: action.shiftIndexes[ action.value ].begin,
							cease: action.shiftIndexes[ action.value ].cease,
						}
					}
				}
			}

			if ( action.field === "begin" && action.value === "" ) {
				const { [ action.employeeId ]: { [ action.date ]: _, ...employeeSchedules } = {}, ...schedules } = state

				return {
					...schedules,
					[ action.employeeId ]: {
						...employeeSchedules
					}
				}

			}

			return state
		}
		case GENERATE_SCHEDULES: {
			const { billingPeriod, billingType, freeDays, shiftList, minDailyBreak, maxWorkTime, minWeeklyBreak } = action.settings
			const { employees, holidayDates } = action
			const schedules = { ...state }

			Object.entries( employees ).map( ([ employeeId, employee ]) => {
				const employeeSchedules = {}
				Object.entries( schedules[ employeeId ] || {} ).map( ([ date, schedule ]) => {
					if ( schedule.preference === true ) {
						employeeSchedules[ date ] = schedule
					}
				})

				employee.timeLeft = selectWorkTimeStateRaw( employeeSchedules, employee.timeContract, action.settings, { holidayDates } )
				employee.freeDays = selectFreeDaysStateRaw( employeeSchedules, { billingPeriod, billingType, freeDays } )
			})

			for ( let m = moment( billingPeriod ); m.isBefore( moment( billingPeriod ).add(1, billingType.toLowerCase()) ); m.add(1, 'days')) {

				if ( holidayDates.includes( m.format( "YYYY-MM-DD" ) ) ) {
					Object.entries( employees ).map( ([ employeeId, employee ]) => {
						if ( schedules[ employeeId ][ m.format( "YYYY-MM-DD" ) ] === undefined || schedules[ employeeId ][ m.format( "YYYY-MM-DD" ) ].preference !== true  ) {
							schedules[ employeeId ] = schedules[ employeeId ] || {}
							schedules[ employeeId ][ m.format( "YYYY-MM-DD" ) ] = { employeeId, date: m.format( "YYYY-MM-DD" ), begin: "WS" }
						}
					})

					continue
				}

				let freeDay = freeDays[ m.format( "ddd" ).toLowerCase() ]
				if ( freeDay?.permanent === true ) {
					Object.entries( employees ).map( ([ employeeId, employee ]) => {
						if ( schedules[ employeeId ][ m.format( "YYYY-MM-DD" ) ] === undefined || schedules[ employeeId ][ m.format( "YYYY-MM-DD" ) ].preference !== true ) {
							schedules[ employeeId ] = schedules[ employeeId ] || {}
							schedules[ employeeId ][ m.format( "YYYY-MM-DD" ) ] = { employeeId, date: m.format( "YYYY-MM-DD" ), begin: freeDay.index }
							employees[ employeeId ].freeDays[ freeDay.index ] -= 1
							console.log( employees[ employeeId ].freeDays[ freeDay.index ] )
						}
					})

					continue
				}

				// console.log()

				const availableEmployees = {}
				const unavailableEmployees = {}
				Object.entries( { ...employees } ).map( ([ employeeId, employee ]) => {
					if ( employee.timeLeft > 0 ) {
						availableEmployees[ employeeId ] = employee
					} else {
						unavailableEmployees[ employeeId ] = employee
					}
				} )

				Object.entries( { ...employees } ).map( ([ employeeId, employee ]) => {
					const schedule =  schedules[ employeeId ]?.[ m.format("YYYY-MM-DD") ]
					if ( schedule?.preference === true ) {
						if ( parseSchedule( schedule, action.settings ).format === TIME_FORMAT ) {
							let scheduleBegin = moment(`${ schedule.date } ${ schedule.begin }`)
							let scheduleCease = moment(`${ schedule.date } ${ schedule.cease }`)

							let workTime = scheduleCease.diff( scheduleBegin, 'hours', true )
							if ( workTime <= 0 ) workTime += 24;

							employee.timeLeft -= workTime
						}
						delete availableEmployees[ employeeId]
					}
				} )

				const availableManagers = {}
				Object.entries( availableEmployees ).filter( ([ employeeId, employee ]) => (
					employee.role === "KIEROWNIK"
				) ).map( ([ employeeId, employee ]) => {
					availableManagers[ employeeId ] = employee
					delete availableEmployees[ employeeId ]
				} )

				const dailySchedules = {}
				Object.entries( shiftList ).map( ([ shiftId, shift ]) => {
					dailySchedules[ shiftId ] = []

					if ( Object.keys( availableManagers ).length > 0 && shift.requireManager === true ) {
						const [ employeeId, employee ] = getMostBored( availableManagers )
						delete availableManagers[ employeeId ]

						let shiftBegin = moment(`${ m.format("YYYY-MM-DD") } ${ shift.begin }`)
						let shiftCease = moment(`${ m.format("YYYY-MM-DD") } ${ shift.cease }`)

						let workTime = shiftCease.diff( shiftBegin, 'hours', true )
						if ( workTime <= 0 ) workTime += 24;

						employees[ employeeId ].timeLeft -= workTime
						dailySchedules[ shiftId ].push( { employeeId, date: m.format("YYYY-MM-DD"), begin: shift.begin, cease: shift.cease } )
					}
				})

				Object.entries( availableManagers ).map( ([ employeeId, employee ]) => {
					availableEmployees[ employeeId ] = employee
				})

				Object.entries( shiftList ).map( ([ shiftId, shift ]) => {
					while ( Object.keys( availableEmployees ).length > 0 && dailySchedules[ shiftId ].length < shift.crew[ m.format("ddd").toLowerCase() ] ) {
						const [ employeeId, employee ] = getMostBored( availableEmployees )
						delete availableEmployees[ employeeId ]

						let shiftBegin = moment(`${ m.format("YYYY-MM-DD") } ${ shift.begin }`)
						let shiftCease = moment(`${ m.format("YYYY-MM-DD") } ${ shift.cease }`)

						let workTime = shiftCease.diff( shiftBegin, 'hours', true )
						if ( workTime <= 0 ) workTime += 24;

						employees[ employeeId ].timeLeft -= workTime
						dailySchedules[ shiftId ].push( { employeeId, date: m.format("YYYY-MM-DD"), begin: shift.begin, cease: shift.cease } )

					}
				})

				Object.entries( dailySchedules ).map( ([ shiftId, dailySchedule ]) => {
					for ( const schedule of dailySchedule ) {
						schedules[ schedule.employeeId ] = schedules[ schedule.employeeId ] || {}
						schedules[ schedule.employeeId ][ schedule.date ] = schedule
					}
				})

				Object.entries( availableEmployees ).map( ([ employeeId, employee ]) => {
					unavailableEmployees[ employeeId ] = employee
					delete availableEmployees[ employeeId ]
				} )

				Object.entries( unavailableEmployees ).map( ([ employeeId, employee ]) => {
					schedules[ employeeId ] = schedules[ employeeId ] || {}
					schedules[ employeeId ][ m.format("YYYY-MM-DD") ] = { employeeId, date: m.format("YYYY-MM-DD"), begin: "W" }
					delete unavailableEmployees[ employeeId ]
				} )
			}

			Object.entries( employees ).map( ([ employeeId, employee ]) => {
				Object.entries( employee.freeDays ).map( ([ freeDayIndex, freeDay ]) => {
					const freeSchedules = {}
					const freeDates = []
					Object.entries( schedules[ employeeId ] ).filter( ([ date, schedule ]) => (
						schedule.begin === "W"
					) ).map( ([ date, schedule ]) => {
						freeSchedules[ date ] = schedule
						freeDates.push( date )
					} )

					while ( freeDates.length > 0 && freeDay > 0 ) {
						const schedule = freeSchedules[ freeDates.splice( Math.floor( Math.random() * freeDates.length ), 1 ) ]
						schedules[ schedule.employeeId ] = schedules[ schedule.employeeId ] || {}
						schedules[ schedule.employeeId ][ schedule.date ].begin = freeDayIndex
						freeDay -= 1
					}
				} )

				// Teraz mozna wydać pozostałe godziny pracy lub uszczuplic obecne jesli jest za duzo
			} )

			let schedulesRefCleaned = JSON.parse( JSON.stringify( schedules ) )
			return { ...schedulesRefCleaned }
		}
		case CLEAR_SCHEDULES: {
			return { }
		}
		case REMOVE_EMPLOYEE: {
			const { [ action.employeeId ]: _, ...schedules } = state

			return schedules
		}
		default:
			return state
	}
}

const getMostBored = ( employees ) => {
	let mostBoredId = Object.keys( employees )[0]
	let mostBored = employees[ mostBoredId ]
	Object.entries( employees ).map( ([ employeeId, employee ]) => {
		if ( mostBored.timeLeft / mostBored.timeContract < employee.timeLeft / employee.timeContract ) {
			mostBoredId = employeeId
			mostBored = employee;
		}
	})
	return [ mostBoredId, mostBored ]
}

export default schedulesReducer
