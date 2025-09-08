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
  notes: z.string().optional()

});
export type EmployeeSchema = typeof employeeSchema;

export const bankSchema = z.object({

   name: z.int({message: 'You must select a Payment Provider'}),
   isDefault: z.boolean({message: "You must select if Payment Method is Default or not. Choose no if you're not sure"}),
   accountNumber: z.string().min(1, {message: "Bank Account cannot be empty"})
});
export type BankSchema = typeof bankSchema;


export const createUserSchema = z.object({
  email: z.email("Invalid email address"),

  name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Name too long"),

  role: z
    .string()
    .min(1, "Role is required"),

  customPerm: z
    .union([z.string(), z.boolean()])
    .transform((val) => val === "true" || val === true)
    .optional()
    .default(false),

  permissions: z
    .array(z.string().or(z.number()))
    .optional()
    .default([]),
})
.refine(
  (data) => {
    if (data.customPerm) {
      return data.permissions && data.permissions.length > 0;
    }
    return true;
  },
  {
    message: "At least one permission must be selected when using custom permissions",
    path: ["permissions"],
  }
);

export type CreateUserSchema = typeof createUserSchema;

export const createRoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(100, "Role name must be under 100 characters"),

  description: z
    .string()
    .min(1, "Role description is required")
    .max(500, "Role description must be under 500 characters"),

  permissions: z
    .array(z.string().min(1))
    .nonempty("At least one permission must be selected")
});


export type CreateRoleInput = z.infer<typeof createRoleSchema>;


export const createSubjectSchema = z.object({
  name: z
    .string()
    .min(1, "Subject name is required")
    .max(100, "Subject name must be under 100 characters"), 

  description: z
    .string()
    .min(1, "Subject description is required")
    .max(500, "Subject description must be under 500 characters"),
});

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;


/**
 * Checks if a given date corresponds to an age within the min-max range.
 * @param date Date to check
 * @param minAge Minimum age (inclusive)
 * @param maxAge Maximum age (inclusive)
 * @returns true if age is within range
 */
export function isAgeInRange(date: Date, minAge: number, maxAge: number): boolean {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();

  // adjust if birthday hasn't occurred yet this year
  const hasHadBirthday =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  if (!hasHadBirthday) age -= 1;

  return age >= minAge && age <= maxAge;
}

const optionalText = () =>
  z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.string().min(1)
  );

export const studentSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  grandFatherName: optionalText().optional(),

  gender: z.string().trim().min(1, "Gender is required"),
  grade: z.string().trim().min(1, "Grade is required"),
  naturalOrSocial: z.string().trim().optional(),
  school: z.string().trim().min(1, "School is required"),

  telegram: z.string().trim().min(1, "Telegram username is required"),

  fee: z.string().trim().min(1, "Fee is required"),
  location: z.string().trim().min(1, "Location is required"),
  specificAddress: z.string().trim().min(1, "Specific address is required"),

  phone: z.string().trim().optional(),
  

  dateOfBirth: z
    .preprocess((val) => {
      // val is a string from <input type="date"> in YYYY-MM-DD format
      if (typeof val === "string") return new Date(val);
      return val;
    }, z.date({ error: "Date of birth is required" }))
    .refine(
      (date) => isAgeInRange(date, 2, 60),
      "Student age must be between 2 and 60"
    ),

  lead: z.string().trim().min(1, "Lead is required"),

  notes: z.string().trim().min(1, "Notes are required"),
});

export type StudentForm = z.infer<typeof studentSchema>;







