export const SAVE = "SAVE"
export const LOAD = "LOAD"

export function saveSchedules() {
	return { type: SAVE }
}

export function loadSchedules( payload ) {
	return { type: LOAD, payload }
}
