export const UPDATE_BILLING_PERIOD = "UPDATE_BILLING_PERIOD"
export const UPDATE_BILLING_TYPE = "UPDATE_BILLING_TYPE"

export function updateBillingPeriod( billingPeriod ) {
	return { type: UPDATE_BILLING_PERIOD, billingPeriod }
}

export function updateBillingType( billingType ) {
	return { type: UPDATE_BILLING_TYPE, billingType }
}
