export const UPDATE_SCHEDULE = "UPDATE_SCHEDULE"

export function updateSchedule( employeeId, date, field, value ) {
	return { type: UPDATE_SCHEDULE, employeeId, date, field, value }
}
