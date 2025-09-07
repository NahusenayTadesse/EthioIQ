import { z } from 'zod/v4';

const dateOfBirthWithMinAge = (minAge: number, name: string) =>
  z.coerce.date().refine((dob) => {
    const today = new Date();
    const ageDiff = today.getFullYear() - dob.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    const age = hasBirthdayPassed ? ageDiff : ageDiff - 1;

    return age >= minAge;
  }, {
    message: `${name} must be at least ${minAge} years old.`,
  });

export const employeeSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  grandFatherName: z.string().min(1, { message: "Grandfather's name is required." }),
  email: z.email({ message: 'Invalid email address.' }),
  gender: z.enum(['male', 'female']),
  address: z.string().min(1, {message: 'Address is required'}),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits long.' }),
 dateOfBirth: dateOfBirthWithMinAge(18,'Employee'), 
  position: z.string().min(1, { message: 'Position is required.' }),
  salary: z.string().optional(),
  hireDate: z.string().min  (1, { message: 'Hire date is required.' }),
  notes: z.string().optional(),
  bank: z.int(),
   isDefault: z.boolean(),
   accountNumber: z.string()

});

export const bankSchema = z.object({

   name: z.int({message: 'You must select a Payment Provider'}),
   isDefault: z.boolean({message: "You must select if Payment Method is Default or not. Choose no if you're not sure"}),
   accountNumber: z.string().min(1, {message: "Bank Account cannot be empty"})
})

export type EmployeeSchema = typeof employeeSchema;