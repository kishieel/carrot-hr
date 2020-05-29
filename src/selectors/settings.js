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

	let billingPeriodName = moment( billingPeriod ).locale('pl').format("MMMM YYYY")
	return billingPeriodName.charAt(0).toUpperCase() + billingPeriodName.slice(1)
}
