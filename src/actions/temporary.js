export const EMPLOYEE_SETTINGS = "EMPLOYEE_SETTINGS"
export const CHANGE_LAYER = "CHANGE_LAYER"

export function showEmployeeSettings( show, employeeId ) {
  return { type: EMPLOYEE_SETTINGS, show, employeeId }
}

export function changeLayer( layer, state ) {
	return { type: CHANGE_LAYER, layer, state }
}
