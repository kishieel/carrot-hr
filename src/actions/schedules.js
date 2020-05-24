export const UPDATE_SCHEDULE = "UPDATE_SCHEDULE"

export function updateSchedule( scheduleId, field, value ) {
	return { type: UPDATE_SCHEDULE, scheduleId, field, value }
}
