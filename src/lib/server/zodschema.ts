import { X } from 'lucide-svelte';
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

export function isAgeInRange(
  dateString: string,
  minAge: number,
  maxAge: number
): boolean {
  const date = new Date(dateString);

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();

  // adjust if birthday hasn't occurred yet this year
  const hasHadBirthday =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  if (!hasHadBirthday) age -= 1;

  return age >= minAge && age <= maxAge;
}


export const studentSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  grandFatherName: z.string().trim().optional(),

  gender: z.string().trim().min(1, "Gender is required"),
  grade: z.string().trim().min(1, "Grade is required"),
  naturalOrSocial: z.string().trim().optional(),
  school: z.string().trim().min(1, "School is required"),

 telegram: z
    .string()
    .trim()
    .min(1, "Telegram username is required")
    .regex(/^@[a-zA-Z0-9_]{5,32}$/, "Invalid Telegram username"),
  fee: z.string().trim().min(1, "Fee is required"),
  location: z.string().trim().min(1, "Location is required"),
  specificLocation: z.string().trim().min(1, "Specific address is required"),

  phone: z.string().trim().optional(),
  

  dateOfBirth: z.string().trim().min(1, "Date of Birth is Required"), 

  lead: z.string().trim().min(1, "Lead is required"),

  notes: z.string().trim().optional(),
});

export type StudentForm = z.infer<typeof studentSchema>;




export const parentSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters long")
    .max(50, "First Name must be less than 50 characters")
    .min(1, "First Name is required"),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters long")
    .max(50, "Last Name must be less than 50 characters")
    .min(1, "Last Name is required"),
  gender: z.string().trim().min(1, "Gender is required"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must be less than 20 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(1, "Phone number is required"),
  specificLocation: z
    .string()
    .min(3, "Specific Address must be at least 3 characters long")
    .max(100, "Specific Address must be less than 100 characters")
    .min(1, "Specific Address is required"),
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")), 
  addNotes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  type: z.string().min(1, "Relation Type is required"),
  livingTogether: z.string().min(1, "Living Together is required"),
    isPrimary: z.string().optional().nullable(),
});

export type ParentSchema = typeof parentSchema;

export const addSubjectSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  profieciencyLevel: z.string().min(1, "Proficiency level is required"),
  startedAt: z.string().min(1, "Start date is required"),
  notes: z.string().optional(),
  id: z.string().min(1, "ID is required"),

});

export type AddSubjectSchema = typeof addSubjectSchema;

export const existingParentSchema = z.object({
  parent: z.string().min(1, { message: "Parent is required" }), // required
 notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")), // allow empty string
  type: z.string().min(1, "Relation Type is required"),
  livingTogether: z.string().min(1, "Living Together is required"),
    isPrimary: z.string().optional().nullable(),


});

export type ExistingParentSchema = typeof existingParentSchema;

export const connectTutorSchema = z.object({
  tutor: z.string().min(1, { message: "Tutor is required" }), // required
  notes: z
    .string()
    .max(500, "Notes must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  subject: z.string().min(1, "Subject is required"),
});

export type ConnectTutorSchema = typeof connectTutorSchema;


export const tutorSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  grandFatherName: z.string().trim().optional(),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number must be less than 20 digits")
    .regex(/^[0-9+\-\s()]+$/, "Invalid phone number format")
    .min(1, "Phone number is required"),
  experience: z.number().max(50, "Tutor Experience cannot be more than 50"),
  gender: z.string().trim().min(1, "Gender is required"),
  gradePreference: z.string().trim().min(1, "Grade Preference is required"),
  naturalOrSocial: z.string().trim().optional(),
  telegram: z
    .string()
    .trim()
    .min(1, "Telegram username is required")
    .regex(/^@[a-zA-Z0-9_]{5,32}$/, "Invalid Telegram username"),
  hourly: z.string().trim().min(1, "Hourly Fee is required"),
  location: z.string().trim().min(1, "Location is required"),
  specificLocation: z.string().trim().min(1, "Specific address is required"),

  dateOfBirth: dateOfBirthWithMinAge(18,'Employee'), 

  lead: z.string().trim().min(1, "Lead is required"),

  image: z
  .instanceof(File, { message: "Please upload a file." })
  .refine((f) => f.size <= 1024 * 1024, "Max upload size is 1MB.")
  .refine(
    (f) => f.type.startsWith("image/"),
    "Only image files are allowed."
  ),

  notes: z.string().trim().optional(),
});

export type TutorForm = z.infer<typeof tutorSchema>;