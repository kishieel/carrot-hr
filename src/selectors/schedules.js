import { createSelector } from 'reselect'

const moment = require('moment')

export const NOT_EXIST = "NOT_EXIST"
export const INVALID_FORMAT = "INVALID_FORMAT"
export const SHIFT_FORMAT = "SHIFT_FORMAT"
export const TIME_FORMAT = "TIME_FORMAT"

const parseSchedule = ( schedule = null, { freeDays, shiftList, maxWorkTime, minDailyBreak } ) => {
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

export const selectParsedSchedule = ( employeeId, date ) => {
	return createSelector(
		state => state.schedules[ employeeId ]?.[ date ],
		state => state.schedules[ employeeId ]?.[ moment( date ).subtract(1, 'day').format("YYYY-MM-DD") ],
		state => state.settings,
		( schedule, previousSchedule, { freeDays, shiftList, maxWorkTime, minDailyBreak } ) => {
			const localSettings = { freeDays, shiftList, maxWorkTime, minDailyBreak }
			const parsedSchedule = parseSchedule( schedule, localSettings )

			if ( parsedSchedule.format === TIME_FORMAT ) {
				let beginDate = moment(`${ schedule.date } ${ schedule.begin }`)
				let ceaseDate = moment(`${ schedule.date } ${ schedule.cease }`)

				let workTime = ceaseDate.diff( beginDate, 'hours', true )
				if ( workTime <= 0 ) workTime += 24;


				parsedSchedule.workTime = moment.utc( moment.duration( workTime, 'hours' ).asMilliseconds() ).format("H:mm")
				if ( workTime > moment.duration( maxWorkTime ).asHours() ) {
					parsedSchedule.isMaxWorkTimeValid = false
				}

				const parsedPreviousSchedule = parseSchedule( previousSchedule, localSettings )
				if ( parsedPreviousSchedule.format === TIME_FORMAT ) {
					let previousBeginDate = moment(`${ previousSchedule.date } ${ previousSchedule.begin }`)
					let previousCeaseDate = moment(`${ previousSchedule.date } ${ previousSchedule.cease }`)

					if ( previousCeaseDate.diff( previousBeginDate ) < 0 ) {
						previousCeaseDate.add(1, 'day')
					}

					let dailyBreak = beginDate.diff( previousCeaseDate, 'hours', true )
					if ( dailyBreak < moment.duration( minDailyBreak ).asHours() ) {
						parsedSchedule.isMinDailyBreak = false
					}
				}
			}

			return parsedSchedule
		}
	)
}

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


export const selectWorkTimeDone = employeeId => {
	return createSelector(
		state => state.schedules[ employeeId ],
		state => state.settings,
		( employeeSchedules, { billingType, billingPeriod, freeDays, shiftList, maxWorkTime, minDailyBreak } ) => {
			let workTimeDone = 0

			for ( let m = moment( billingPeriod ); m.isBefore( moment( billingPeriod ).add(1, billingType.toLowerCase()) ); m.add(1, 'days')) {
				const schedule = employeeSchedules?.[ m.format("YYYY-MM-DD") ] || null
				const parsedSchedule = parseSchedule( schedule, { freeDays, shiftList, maxWorkTime, minDailyBreak } )
				if ( parsedSchedule.format === TIME_FORMAT ) {
					let beginDate = moment(`${ schedule.date } ${ schedule.begin }`)
					let ceaseDate = moment(`${ schedule.date } ${ schedule.cease }`)

					let workTime = ceaseDate.diff( beginDate, 'hours', true )
					if ( workTime <= 0 ) workTime += 24;

					workTimeDone += workTime
				}
			}

			return workTimeDone
		}
	)
}
