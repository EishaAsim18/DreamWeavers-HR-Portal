/**
 * Employees API client.
 *
 * Thin typed wrapper around the mock backend handlers.
 * Swap these for real fetch() calls when the backend exists —
 * the rest of the feature stays unchanged.
 */

import { useAuth } from '@/shared/hooks/use-auth'
import {
  mockFetchEmployees,
  mockCreateEmployee,
  mockUpdateEmployee,
  mockDeleteEmployee,
} from '@/shared/api/mock/employees.mock'
import type { Employee, EmployeeFormData } from '../types/employee.types'
import type { User } from '@/shared/types'

export const employeesApi = {
  fetchEmployees: (user: User) => mockFetchEmployees(user),
  createEmployee: (user: User, data: EmployeeFormData) => mockCreateEmployee(user, data),
  updateEmployee: (user: User, id: string, updates: Partial<EmployeeFormData>) =>
    mockUpdateEmployee(user, id, updates),
  deleteEmployee: (user: User, id: string) => mockDeleteEmployee(user, id),
} as const

/** Returns API methods pre-bound to the currently authenticated user. */
export function useEmployeesApi() {
  const { user } = useAuth()

  if (!user) throw new Error('useEmployeesApi must be used when authenticated')

  return {
    fetchEmployees: (): Promise<Employee[]> => employeesApi.fetchEmployees(user),
    createEmployee: (data: EmployeeFormData) => employeesApi.createEmployee(user, data),
    updateEmployee: (id: string, updates: Partial<EmployeeFormData>) =>
      employeesApi.updateEmployee(user, id, updates),
    deleteEmployee: (id: string) => employeesApi.deleteEmployee(user, id),
  }
}
