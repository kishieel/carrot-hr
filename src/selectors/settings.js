import { createSelector } from 'reselect'

const moment = require('moment')

export const selectDatesFromPeriod = createSelector(
	state => state.settings,
	({ billingType, billingPeriod }) => {
	  	const dates = []

		if ( billingType === "QUARTER" ) {
			for (let m = moment( billingPeriod ); m.isBefore( moment( billingPeriod ).add(1, 'quarter') ); m.add(1, 'days')) {
			  	dates.push( m.format("YYYY-MM-DD") );
			}
		} else {
			for (let m = moment( billingPeriod ); m.isBefore( moment( billingPeriod ).add(1, 'month') ); m.add(1, 'days')) {
			  	dates.push( m.format("YYYY-MM-DD") );
			}
		}

		return dates
	}
)

export const selectBillingPeriodName = ( billingType, billingPeriod ) => {

	if ( billingType === "QUARTER" ) {
		return moment( billingPeriod ).format("Q [kwartał] YYYY")
	}

	let billingPeriodName = moment( billingPeriod ).format("MMMM YYYY")
	return billingPeriodName.charAt(0).toUpperCase() + billingPeriodName.slice(1)
}

export const selectWorkHours = createSelector(
	state => state.settings,
	state => state.temporary,
	(_, dates) => dates,
	({ freeDays, billingType, billingPeriod }, { holidayDates }, dates) => {
		let time = 0

		for ( const date of dates ) {
			let dayName = moment(date).format("ddd").toLowerCase()
			let freeDay = freeDays[ dayName ] || null

			if ( freeDay === null ) {
				time += 8
			}

			if ( dayName !== "sun" && holidayDates.includes(date) ) {
				time -= 8
			}
		}

		return time
	}
)

export const selectFreeDays = createSelector(
	state => state.settings,
	(_, dates) => dates,
	({ freeDays }, dates) => {
		let freeDaysAmount = { }
		for ( const date of dates ) {
			let dayName = moment(date).format("ddd").toLowerCase()
			let freeDay = freeDays[ dayName ] || null
			if ( freeDay !== null ) {
				if ( freeDaysAmount[ dayName ] === undefined ) {
					freeDaysAmount[ dayName ] = { index: freeDays[ dayName ].index, left: 0 }
				}
				freeDaysAmount[ dayName ].left += 1
			}
		}
		return freeDaysAmount
	}
)
