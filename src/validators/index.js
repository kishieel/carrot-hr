import { createSelector } from 'reselect'
import {
	parseSchedule,
	TIME_FORMAT
} from '../selectors/schedules'

const moment = require('moment')

export const validWeeklySchedule = ( employeeId, week ) => createSelector(
	state => state.schedules[ employeeId ],
	state => state.settings,
	( employeeSchedules, { freeDays, shiftList, minWeeklyBreak } ) => {
		const validation = { status: true, message: "" }

		let isWeeklyBreak = true
		const weekSchedules = {}

		for ( let m = moment( week[0] ); m.isBefore( moment( week[ week.length - 1 ] ).add(1, 'days') ); m.add(1, 'days') ) {
			if ( m.format("ddd").toLowerCase() === "sun" ) {
				const previousDate = m.clone().subtract(1, 'days').format("YYYY-MM-DD")
				const nextDate = m.clone().add(1, 'days').format("YYYY-MM-DD")

				const previousSchedule = employeeSchedules?.[ previousDate ]
				const nextSchedule = employeeSchedules?.[ nextDate ]

				let previousScheduleCease = moment(`${ previousDate } 0:00`)
				let nextScheduleBegin = moment(`${ nextDate } 24:00`)

				if ( parseSchedule( previousSchedule, { freeDays, shiftList } ).format === TIME_FORMAT ) {
					let previousScheduleBegin = moment(`${ previousDate } ${ previousSchedule.begin }`)
					previousScheduleCease = moment(`${ previousDate } ${ previousSchedule.cease }`)

					let workTime = previousScheduleCease.diff( previousScheduleBegin, 'hours', true )
					if ( workTime <= 0 ) {
						previousScheduleCease.add(1, 'days')
					}
				}

				if ( parseSchedule( nextSchedule, { freeDays, shiftList } ).format === TIME_FORMAT ) {
					nextScheduleBegin = moment(`${ nextDate } ${ nextSchedule.begin }`)
				}

				let diff = nextScheduleBegin.diff( previousScheduleCease, 'hours', true )
				if ( diff <= moment.duration( minWeeklyBreak ).asHours() ) {
					isWeeklyBreak = false
					break
				}
			}
		}

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

export const validDailyCrew = ( date ) => createSelector(
	state => state.schedules,
	state => state.settings,
	( schedules, { billingPeriod, billingType, shiftList } ) => {
		const validation = { status: true, message: "" }

		let dailyCrew = {}
		Object.entries( schedules ).map( ([ employeeId, employeeSchedules ]) => {
			const [ dateId, employeeSchedule ] = Object.entries( employeeSchedules ).find( ([ dateId, schedule ]) =>	schedule.date === date ) || [ null, null ]

			Object.entries( shiftList ).map( ([ shiftId, shift ]) => {
				if ( employeeSchedule?.begin === shift.begin ) {
					if ( dailyCrew[ shiftId ] === undefined ) {
						dailyCrew[ shiftId ] = 0
					}
					dailyCrew[ shiftId ] += 1
				}
			})
		})

		Object.entries( shiftList ).map( ([ shiftId, shift ]) => {
			let requiredCrewAmount = shift.crew[ moment( date ).format( "ddd" ).toLowerCase() ]
			let employeeAmount = dailyCrew[ shiftId ] || 0

			if ( employeeAmount < requiredCrewAmount ) {
				validation.status = false
				validation.message += `Brakuje ${ requiredCrewAmount - employeeAmount } pracowników na zmianie "${ shiftList[ shiftId ].name }"\n`
			}
		} )

		return validation
	}
)
