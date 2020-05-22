const EMPLOYEE_SETTINGS = "EMPLOYEE_SETTINGS"

export function showEmployeeSettings( show, employeeId ) {
  return { type: EMPLOYEE_SETTINGS, show, employeeId }
}
