import { createSelector } from 'reselect'

const moment = require('moment')

export const selectWorkTimeDone = employeeId => {
	return createSelector(
		state => state.schedules[ employeeId ],
		state => state.settings,
		( employeeSchedules, { billingType, billingPeriod },  ) => {
			let workTimeDone = 0

			for ( let m = moment( billingPeriod ); m.isBefore( moment( billingPeriod ).add(1, billingType.toLowerCase()) ); m.add(1, 'days')) {
				const schedule = employeeSchedules?.[ m.format("YYYY-MM-DD") ] || null
				if ( schedule !== null ) {
					// HERE I ENDED
				}
			}

			return workTimeDone
		}
	)
}
