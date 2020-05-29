import { createSelector } from 'reselect'

const moment = require('moment')

export const NOT_EXIST = "NOT_EXIST"
export const INVALID_FORMAT = "INVALID_FORMAT"
export const SHIFT_FORMAT = "SHIFT_FORMAT"
export const TIME_FORMAT = "TIME_FORMAT"

export const parseSchedule = ( schedule = null, { freeDays, shiftList } ) => {
	if ( schedule === null ) {
		return { }
	}

	let shifts = [ "W", "WS" ]
	Object.entries( freeDays ).map( ([ dayName, freeDay ]) => {
		if ( freeDay !== null && freeDay.index !== "" ) {
			shifts.push( freeDay.index )
		}
	})
	Object.entries( shiftList ).map( ([ shiftId, shift ]) => {
		if( shift.index !== "" ) {
			shifts.push( shift.index )
		}
	})

	if ( shifts.includes( schedule.begin ) ) {
		return { format: SHIFT_FORMAT }
	}

	let timeReg = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;
	if ( timeReg.test( schedule.begin ) && timeReg.test( schedule.cease ) ) {
		return { format: TIME_FORMAT }
	}

	return { format: INVALID_FORMAT }
}

export const selectDailySchedule = ( employeeId, date ) => createSelector(
	state => state.schedules[ employeeId ]?.[ date ],
	state => state.schedules[ employeeId ]?.[ moment( date ).subtract(1, 'day').format("YYYY-MM-DD") ],
	state => state.settings,
	( currentSchedule, previousSchedule, { freeDays, shiftList, maxWorkTime, minDailyBreak } ) => {
		const validation = { status: true, message: "" }

		const parsedCurrentSchedule = parseSchedule( currentSchedule, { freeDays, shiftList } )
		currentSchedule = Object.assign( currentSchedule || {}, parsedCurrentSchedule )

		if ( currentSchedule.format === TIME_FORMAT ) {
			let currentScheduleBegin = moment(`${ currentSchedule.date } ${ currentSchedule.begin }`)
			let currentScheduleCease = moment(`${ currentSchedule.date } ${ currentSchedule.cease }`)

			let workTime = currentScheduleCease.diff( currentScheduleBegin, 'hours', true )
			if ( workTime <= 0 ) workTime += 24;

			currentSchedule.workTime = moment.utc( moment.duration( workTime, 'hours' ).asMilliseconds() ).format("H:mm")
			if ( workTime > moment.duration( maxWorkTime ).asHours() ) {
				validation.status = false
				validation.message += "Przekroczony maksymalny dzienne czas pracy.\n"
			}

			const parsedPreviousSchedule = parseSchedule( previousSchedule, { freeDays, shiftList } )
			if( parsedPreviousSchedule.format === TIME_FORMAT ) {
				let previousScheduleBegin = moment(`${ previousSchedule.date } ${ previousSchedule.begin }`)
				let previousScheduleCease = moment(`${ previousSchedule.date } ${ previousSchedule.cease }`)

				if ( previousScheduleCease.diff( previousScheduleBegin ) < 0 ) {
					previousScheduleCease.add(1, 'day')
				}

				let dailyBreak = currentScheduleBegin.diff( previousScheduleCease, 'hours', true )
				if ( dailyBreak < moment.duration( minDailyBreak ).asHours() ) {
					validation.status = false
					validation.message += "Złamano minimalna przerwę między zmianami.\n"
				}

				let a = currentScheduleBegin.diff( previousScheduleBegin, 'hours', true )
				if ( a < 24 ) {
					validation.status = false
					validation.message += "Złamano dobę pracowniczą.\n"
				}
			}
		} else if ( currentSchedule.format === INVALID_FORMAT ) {
			validation.status = false
			validation.message += "Nieprawidłowy format wpisu.\n"
		}

		return { schedule: currentSchedule, validation }
	}
)

export const selectWeekSchedulesValidation = ( employeeId, week ) => createSelector(
	state => Object.entries( state.schedules[ employeeId ] || {} ).filter( ([ date, schedule ]) => week.includes( date )).map( ([ date, schedule ]) => { return schedule } ),
	state => state.settings,
	( schedules, { minWeeklyBreak } ) => {
		schedules.sort( ( a,b ) => moment( a.date ) - moment( b.date ) )

		week.map( date => {

		})
		return "CARROT"
	}
)

export const selectWorkTimeState = ( employeeId ) => createSelector(
	state => state.schedules[ employeeId ],
	state => state.settings,
	state => state.temporary,
	( schedules, { billingPeriod, billingType, freeDays, shiftList, maxWorkTime, minDailyBreak }, { holidayDates } ) => {
		let workTimeState = 0
		for ( let m = moment( billingPeriod ); m.isBefore( moment( billingPeriod ).add(1, billingType.toLowerCase()) ); m.add(1, 'days')) {
			let dayName = m.format("ddd").toLowerCase()
			let freeDay = freeDays[ dayName ] || null

			if ( freeDay === null ) {
				workTimeState += 8
			}

			if ( dayName !== "sun" && holidayDates.includes( m.format("YYYY-MM-DD") ) ) {
				workTimeState -= 8
			}
		}

		Object.entries( schedules || {} ).map( ([ date, schedule ]) => {
			const parsedSchedule = parseSchedule( schedule, { freeDays, shiftList } )
			if ( parsedSchedule.format === TIME_FORMAT ) {
				let beginDate = moment(`${ schedule.date } ${ schedule.begin }`)
				let ceaseDate = moment(`${ schedule.date } ${ schedule.cease }`)

				let workTime = ceaseDate.diff( beginDate, 'hours', true )
				if ( workTime <= 0 ) workTime += 24;

				workTimeState -= workTime
			}
		})

		return workTimeState
	}
)

export const selectFreeDaysState = ( employeeId ) => createSelector(
	state => state.schedules[ employeeId ],
	state => state.settings,
	( schedules, { billingPeriod, billingType, freeDays } ) => {
		let freeDaysState = { }
		let freeDaysIndexes = []
		for ( let m = moment( billingPeriod ); m.isBefore( moment( billingPeriod ).add(1, billingType.toLowerCase()) ); m.add(1, 'days')) {
			let dayName = m.format("ddd").toLowerCase()
			let freeDay = freeDays[ dayName ]
			if ( freeDay !== null ) {
				let freeDayIndex = freeDay.index
				if ( freeDaysState[ freeDayIndex ] === undefined ) {
					freeDaysState[ freeDayIndex ] = 0
					freeDaysIndexes.push( freeDayIndex )
				}
				freeDaysState[ freeDayIndex ] += 1
			}
		}

		Object.entries( schedules || {} ).map( ([ date, schedule ]) => {
			let freeDayIndex = schedule.begin
			if ( freeDaysIndexes.includes( freeDayIndex ) ) {
				freeDaysState[ freeDayIndex ] -= 1
			}
		})

		return freeDaysState
	}
)
