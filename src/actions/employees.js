const CREATE_EMPLOYEE = "CREATE_EMPLOYEE"

export function createEmployee( signature ) {
  return { type: CREATE_EMPLOYEE, signature }
}
