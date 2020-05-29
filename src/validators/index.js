import { createSelector } from 'reselect'
import {
	parseSchedule,
	TIME_FORMAT
} from '../selectors/schedules'

const moment = require('moment')

export const validWeeklySchedule = ( employeeId, week ) => createSelector(
	state => state.schedules[ employeeId ],
	state => state.settings,
	( schedules, { freeDays, shiftList, minWeeklyBreak } ) => {
		const validation = { status: true, message: "" }

		const weekSchedules = {}

		Object.entries( schedules || {} ).filter( ([ date, schedule ]) => week.includes( date )).map( ([ date, schedule ]) => {
			weekSchedules[ date ] = schedule
		} )

		let schedule = null
		let previousScheduleCease = moment(`${ week[0] } 0:00`)
		let isWeeklyBreak = false
		week.map( date => {
			if ( schedule !== null ) {
				if ( parseSchedule( schedule, { freeDays, shiftList } ).format === TIME_FORMAT ) {
					previousScheduleCease = moment( `${ schedule.date } ${ schedule.cease }` )

					let previousScheduleBegin = moment( `${ schedule.date } ${ schedule.cease }` )
					if ( previousScheduleCease.diff( previousScheduleBegin ) < 0 ) {
						previousScheduleCease.add(1, 'days')
					}
				}
			}

			schedule = weekSchedules[ date ] || null
			if ( date !== week[0] ) {
				let currentScheduleBegin = null
				if ( parseSchedule( schedule, { freeDays, shiftList } ).format === TIME_FORMAT ) {
					currentScheduleBegin = moment( `${ schedule.date } ${ schedule.begin }` )
				} else {
					currentScheduleBegin = moment( `${ date } 24:00` )
				}

				let diff = currentScheduleBegin.diff( previousScheduleCease, 'hours', true )
				if ( diff > moment.duration( minWeeklyBreak ).asHours() ) {
					isWeeklyBreak = true
				}
			}
		})

		if ( isWeeklyBreak === false ) {
			validation.status = false
			validation.message = "Brak minimalnej przerwy tygodniowej.\n"
		}

		return validation
	}
)

export const validFreeDays = ( freeDaysState ) => {
	const validation = { status: true, message: "" }

	Object.entries( freeDaysState ).map( ([ dayIndex, value ]) => {
		if ( value !== 0 ) {
			validation.status = false
			if ( validation.message !== "" ) {
				validation.message += `\n`
			}

			if ( value > 0 ) {
				validation.message += `Zaległe dni wolne ${ dayIndex } : ${ value }`
			} else if ( value < 0 ) {
				validation.message += `Nadmiar dni wolne ${ dayIndex } : ${ Math.abs( value ) }`
			}
		}
	} )

	return validation
}

export const validWorkTime = ( workTime ) => {
	const validation = { status: true, message: "" }

	if ( workTime !== 0 ) {
		validation.status = false
		if ( workTime > 0 ) {
			validation.message = "Nie wykorzystano dostępnego czasu pracy."
		} else if ( workTime < 0 ) {
			validation.message = "Przekroczono dostępny czas pracy."
		}
	}

	return validation
}
