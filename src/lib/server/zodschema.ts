import { z } from 'zod/v4';

export const employeeSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  grandFatherName: z.string().min(5, { message: "Grandfather's name is required." }),
  email: z.email({ message: 'Invalid email address.' }),
  gender: z.enum(['male', 'female']),
  address: z.string(),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits long.' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required.' }),
  position: z.string().min(1, { message: 'Position is required.' }),
  salary: z.string().optional(),
  hireDate: z.string().min  (1, { message: 'Hire date is required.' }),
  notes: z.string().optional(),

});

export type EmployeeSchema = typeof employeeSchema;