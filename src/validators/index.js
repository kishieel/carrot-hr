import { createSelector } from 'reselect'

const moment = require('moment')


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
