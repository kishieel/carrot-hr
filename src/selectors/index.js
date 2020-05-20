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

// const getDates = ( state ) => {
// 	const dates = []
//
// 	console.log( state )

	// if ( state.settings.billingType === "QUARTER" ) {
	// 	for (let m = moment( state.settings.billingPeriod ); m.isBefore( m.add(1, 'quarter') ); m.add(1, 'days')) {
	// 	  	dates.push( m.format("YYYY-MM-DD") );
	// 	}
	// } else {
	// 	for (let m = moment( state.settings.billingPeriod ); m.isBefore( m.add(1, 'month') ); m.add(1, 'days')) {
	// 	  	dates.push( m.format("YYYY-MM-DD") );
	// 	}
	// }
//
// 	return dates
// }
//
// export const makeDatesFromPeriod = () => createSelector(
//   [ getDates ],
//   ( dates ) => ({ dates })
// )
