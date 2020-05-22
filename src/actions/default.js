const SAVE = "SAVE"
const LOAD = "LOAD"

export function saveSchedules() {
	return { type: SAVE }
}

export function loadSchedules( payload ) {
	return { type: LOAD, payload }
}
