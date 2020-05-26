export const UPDATE_SETTINGS = "UPDATE_SETTINGS"
export const SET_FREE_DAYS = "SET_FREE_DAYS"
export const UPDATE_FREE_DAYS = "UPDATE_FREE_DAYS"
export const UPDATE_BILLING_TYPE = "UPDATE_BILLING_TYPE"
export const UPDATE_SHIFT_TIMES = "UPDATE_SHIFT_TIMES"
export const UPDATE_SHIFT_CREW = "UPDATE_SHIFT_CREW"

export function updateSettings( field, value ) {
	return { type: UPDATE_SETTINGS, field, value }
}

export function updateBillingType( billingType ) {
	return { type: UPDATE_BILLING_TYPE, billingType }
}

export function setFreeDays( day, checked ) {
	return { type: SET_FREE_DAYS, day, checked }
}

export function updateFreeDays( day, field, value ) {
	return { type: UPDATE_FREE_DAYS, day, field, value }
}

export function updateShiftTimes( shiftNumber, field, value ) {
	return { type: UPDATE_SHIFT_TIMES, shiftNumber, field, value}
}

export function updateShiftCrew( day, field, value ) {
	return { type: UPDATE_SHIFT_CREW, day, field, value}
}
