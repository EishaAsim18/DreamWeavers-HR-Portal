import { z } from 'zod'

export const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  // super_admin is deliberately not accepted — enforced here, in the UI and in the mock API
  role: z.enum(['admin', 'employee'], { message: 'Select a role' }),
  department: z.string().min(2, 'Select a department'),
  jobTitle: z.string().min(2, 'Job title is required'),
  status: z.enum(['active', 'on_leave', 'inactive']),
  joinDate: z.string().min(1, 'Join date is required'),
  location: z.string().min(2, 'Location is required'),
})

export type EmployeeFormValues = z.infer<typeof employeeSchema>
