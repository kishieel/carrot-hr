export const UPDATE_SCHEDULE_ON_CHANGE = "UPDATE_SCHEDULE_ON_CHANGE"
export const UPDATE_SCHEDULE_ON_BLUR = "UPDATE_SCHEDULE_ON_BLUR"
export const GENERATE_SCHEDULES = "GENERATE_SCHEDULES"
export const CLEAR_SCHEDULES = "CLEAR_SCHEDULES"

export function updateScheduleOnChange( employeeId, date, field, value ) {
	return { type: UPDATE_SCHEDULE_ON_CHANGE, employeeId, date, field, value }
}

export function updateScheduleOnBlur( employeeId, date, field, value, shifts ) {
	const shiftIndexes = {}
	Object.entries( shifts ).map( ([ shiftId, shift ]) => {
		const { index, begin, cease } = shift
		if ( index !== "" ) {
			shiftIndexes[ index ] = { begin, cease }
		}
	})
	return { type: UPDATE_SCHEDULE_ON_BLUR, employeeId, date, field, value, shiftIndexes }
}

export function generateSchedules( employees, settings, holidayDates ) {
	return { type: GENERATE_SCHEDULES, employees, settings, holidayDates }
}

export function clearSchedules( ) {
	return { type: CLEAR_SCHEDULES }
}
