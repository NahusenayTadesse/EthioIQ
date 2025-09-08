import { pgTable, varchar, timestamp, boolean, integer, serial, text, json, uuid, date, time, decimal} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: varchar('name', {length: 255}).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	roleId: integer('role_id').references(() => roles.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
	isActive: boolean('is_active').notNull().default(true)
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const roles = pgTable('roles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const permissions = pgTable('permissions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const rolePermissions = pgTable('role_permissions', {
    id: serial('id').primaryKey(),
  roleId: integer('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: integer('permission_id').notNull().references(() => permissions.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const specialPermissions = pgTable('special_permissions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  permissionId: integer('permission_id').notNull().references(() => permissions.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const userPermissions = pgTable("user_permissions", {
  id: serial('id').primaryKey(),
  userId: varchar("user_id").notNull().references(() => user.id),
  permissionId: integer("permission_id").notNull().references(() => permissions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const persons = pgTable('persons', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').references(() => user.id),
  image: varchar('image').default('https://avatar.iran.liara.run/public/12'),
  type: varchar('type', { length: 20 }).notNull(), // 'student', 'tutor', 'parent', 'employee'
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  grandFatherName: varchar('grand_father_name', {length: 50}),
  dateOfBirth: date('date_of_birth'),
  gender: varchar('gender', { length: 10 }),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  personId: uuid('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}),
  grade: varchar('grade', { length: 20 }),
  gradeId: integer('grade_id').notNull().references(()=> grades.id),
  school: integer('school').notNull().references(() => schools.id),
  naturalOrSocial: varchar('natural_or_social', {length: 20}),
  notes: text('notes'),
  location: integer('location').notNull().references(() => locations.id),
  fee: integer('fee').notNull().default(400), //delete this column on next version 
  feesId: integer('fees_id').notNull().default(1).references(()=> fees.id), //make this fee instead of fees on next version 
  specificLocation: text('specific_location').notNull(),
  prefferedGender: varchar('gender', {length: 10}).notNull().default('female'),
  isActive: boolean('is_active').notNull().default(true),
  behaviour: varchar('behaviour', { length: 100}),
  lead: integer('lead').references(()=>leads.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
}); 

export const tutors = pgTable('tutors', {
  id: serial('id').primaryKey(),
  personId: uuid('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}),
  qualifications: text('qualifications'),
  gradePreference: varchar('grade_preference', { length: 20 }),
  location: integer('location').notNull().references(() => locations.id),
  specificLocation: text('specific_location').notNull(),
  naturalOrSocial: varchar('natural_or_social', {length: 20}),
  entranceExamScore: integer('entrance_exam_score'),
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  hireDate: date('hire_date'),
  experience: integer('experience'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const parents = pgTable('parents', {
  id: serial('id').primaryKey(),
  personId: uuid('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}),
  isActive: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  personId: uuid('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}  ),
  position: varchar('position', { length: 100 }).notNull(),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  hireDate: date('hire_date').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const studentParentRelations = pgTable('student_parent_relations', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.id),
  parentId: integer('parent_id').notNull().references(() => parents.id),
  relationshipType: varchar('relationship_type', { length: 50 }).notNull(), // 'mother', 'father', 'guardian', etc.
  livingTogether: boolean('living_together').notNull().default(true),
  isPrimary: boolean('is_primary').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const subjects = pgTable('subjects', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  category: varchar('category', { length: 50 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const subjectStudents = pgTable('subject_students', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  studentId: integer('student_id').notNull().references(() => students.id),
  proficiencyLevel: varchar('proficiency_level', { length: 50 }),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  assessmentResultsId: integer('assessment_results_id').references(() => assessmentResults.id),
  stoppedAt: timestamp('stopped_at'),
  cancelReason: text('cancel_reason'),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const subjectTutors = pgTable('subject_tutors', {
  id: serial('id').primaryKey(),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  tutorId: integer('tutor_id').notNull().references(() => tutors.id),
  proficiencyLevel: varchar('proficiency_level', { length: 50 }).notNull(),
  experience: integer('experience').notNull(),
  gradePreference: varchar('grade_preference', { length: 50 }),
  notes: text('notes'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const locations = pgTable('locations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  directions: text('directions'),
  branches: varchar('branch', { length: 100 }).notNull().array(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const schools = pgTable('schools',{

  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', {length: 20}), 
  noOfStudents: integer('no_of_students'),
  noOfBranches: integer('no_of_branches'),
  location: varchar('location', { length: 100 }).notNull(),
  adminName: varchar('admin_name', { length: 100 }),
  adminContact: varchar('admin_contact', {length: 100}),
}); 


export const revenue_summaries = pgTable('revenue_summaries', {
  tutorId: integer('tutor_id').references(() => tutors.id),
  subjectId: integer('subject_id').references(() => subjects.id),
  period: date('period').notNull(), // e.g., '2025-07-01' for July 2025
  totalSessions: integer('total_sessions').notNull(),
  totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const tutoringSessions = pgTable('tutoring_sessions', {
  id: serial('id').primaryKey(),
  tutorId: integer('tutor_id').notNull().references(() => tutors.id),
  studentId: integer('student_id').notNull().references(() => students.id),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  locationId: integer('location_id').references(() => locations.id),
  scheduledStart: timestamp('scheduled_start').notNull(),
  scheduledEnd: timestamp('scheduled_end').notNull(),
  actualStart: timestamp('actual_start'),
  actualEnd: timestamp('actual_end'),
  status: varchar('status', { length: 20 }).notNull().default('scheduled'),
  payableHours: decimal('payable_hours', { precision: 5, scale: 2 }).notNull().default('0.00'),
  paidStatus: boolean('paid_status').notNull().default(false), 
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const attendance = pgTable('attendance', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').notNull().references(() => tutoringSessions.id),
  studentId: integer('student_id').notNull().references(() => students.id),
  status: varchar('status', { length: 20 }).notNull(), // 'present', 'absent', 'late', 'excused'
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const tutorStudentMatches = pgTable('tutor_student_matches', {
  id: serial('id').primaryKey(),
  tutorId: integer('tutor_id').notNull().references(() => tutors.id),
  studentId: integer('student_id').notNull().references(() => students.id),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  matchDate: date('match_date').notNull().defaultNow(),
  endDate: date('end_date'),
  isActive: boolean('is_active').notNull().default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const studentStudyPlans = pgTable('student_study_plans', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.id),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isCompleted: boolean('is_completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const student_progress = pgTable('student_progress', {
  id: serial('id').primaryKey(),
  studentId: integer('student_id').notNull().references(() => students.id),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  progressNote: text('progress_note').notNull(),
  recordedBy: varchar('recorded_by').notNull().references(() => user.id),
  progressDate: date('progress_date').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const assessments = pgTable('assessments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  subjectId: integer('subject_id').notNull().references(() => subjects.id),
  maxScore: integer('max_score'),
  passingScore: integer('passing_score'),
  numberOfQuestions: integer('number_of_questions'),
  questions: text('questions'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const assessmentResults = pgTable('assessment_results', {
  id: serial('id').primaryKey(),
  assessmentId: integer('assessment_id').notNull().references(() => assessments.id),
  studentId: integer('student_id').notNull().references(() => students.id),
  score: integer('score'),
  dateTaken: date('date_taken').notNull().defaultNow(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const paymentMethods = pgTable('payment_methods', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const personPaymentMethods = pgTable('person_payment_methods', {
  id: serial('id').primaryKey(),
  personId: uuid('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}),
  paymentMethodId: integer('payment_method_id').notNull().references(() => paymentMethods.id),
  accountNumber: varchar('account_number', {length: 50}),
  isDefault: boolean('is_default').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id').notNull().references(() => parents.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethodId: integer('payment_method_id').notNull().references(() => paymentMethods.id),
  paymentDate: timestamp('payment_date').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull(), // 'pending', 'completed', 'unpaid', 'refunded'
  transactionId: varchar('transaction_id', { length: 255 }),
  month: varchar('month', { length: 20 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const paymentSessions = pgTable('payment_sessions', {
  id: serial('id').primaryKey(),
  paymentId: integer('payment_id').notNull().references(() => payments.id),
  sessionId: integer('session_id').notNull().references(() => tutoringSessions.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id').notNull().references(() => parents.id),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull().unique(),
  issueDate: date('issue_date').notNull().defaultNow(),
  dueDate: date('due_date').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'draft', 'sent', 'paid', 'overdue'
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
}); 



export const tutorPayments = pgTable('tutor_payments', {
  id: serial('id').primaryKey(),
  tutorId: integer('tutor_id').notNull().references(() => tutors.id),
  sessionId: integer('session_id').references(() => tutoringSessions.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  invoiceId: integer('invoice_id').notNull().references(()=>invoices.id),
  month: varchar('month', { length: 20 }).notNull(),
  paymentDate: timestamp('payment_date').notNull().defaultNow(),
  paymentMethodId: integer('payment_method_id').notNull().references(() => paymentMethods.id),
  status: varchar('status', { length: 20 }).notNull(), // 'pending', 'paid', 'cancelled'
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const tutor_ratings = pgTable('tutor_ratings', {
  id: serial('id').primaryKey(),
  tutorId: integer('tutor_id').notNull().references(() => tutors.id),
  studentId: integer('student_id').references(() => students.id),
  parentId: integer('parent_id').references(() => parents.id),
  rating: integer('rating').notNull(), // 1-5
  comments: text('comments'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const employeePayments = pgTable('employee_payments', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id').notNull().references(() => employees.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentDate: date('payment_date').notNull().defaultNow(),
  paymentMethodId: integer('payment_method_id').notNull().references(() => paymentMethods.id),
  periodStart: timestamp('period_start').notNull(),
  month: varchar('month', { length: 20 }).notNull(),
  periodEnd: date('period_end').notNull(),
  status: varchar('status', { length: 20 }).notNull(), // 'pending', 'paid', 'cancelled'
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  tutorId: integer('tutor_id').references(() => tutors.id),
  studentId: integer('student_id').references(() => students.id),
  subjectId: integer('subject_id').references(() => subjects.id),
  dayOfWeek: integer('day_of_week').notNull(), // 0-6 (Sunday-Saturday)
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  isRecurring: boolean('is_recurring').notNull().default(true),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  locationId: integer('location_id').references(() => locations.id),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const cancellations = pgTable('cancellations', {
  id: serial('id').primaryKey(),
  cancelledBy: uuid('cancelled_by').notNull().references(() => persons.id, {onDelete: 'cascade'}),
  reason: text('reason').notNull(),
  cancellationDate: timestamp('cancellation_date').notNull().defaultNow(),
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
  refundStatus: varchar('refund_status', { length: 20 }), // 'pending', 'processed', 'denied', 'no refund'
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  personId: uuid('person_id').notNull().references(() => persons.id, {onDelete: 'cascade'}), // FK -> person.id
  type: varchar('type', { length: 50 }).notNull(), // 'phone', 'email', 'telegram', etc.
  value: varchar('value', {length: 100 }), // e.g., 'personal', 'work', 'mother', 'emergency'
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});



export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: varchar('user_id').notNull().references(() => user.id),
  entityType: varchar('entity_type', { length: 50 }).notNull(), // 'student', 'tutor', 'session', etc.
  entityId: integer('entity_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  action: varchar('action', { length: 50 }).notNull(), // 'create', 'update', 'delete', 'login', etc.
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: varchar('entity_id', { length: 50 }).notNull(),
  userId: varchar('user_id').references(() => user.id),
  oldValues: json('old_values'),
  newValues: json('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 1024 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});


export const documents = pgTable('documents', {
  id: text('id').primaryKey(),
  ownerId: uuid('owner_id').notNull().references(() => persons.id, {onDelete: 'cascade'}), // FK to person.id
  ownerType: text('owner_type').notNull(), // 'tutor', 'student', 'employee', 'parent'
  documentType: text('document_type').notNull(), // 'id_card', 'contract', etc.
  fileUrl: text('file_url').notNull(), 
  uploadedBy: varchar('uploaded_by').notNull().references(() => user.id), 
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
}); 

export const fieldOfStudy = pgTable('field_of_study', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  tutorId: integer('tutor_id').notNull().references(() => tutors.id),
  degreeType: varchar('degree_type', {length: 50}),
  gpa: decimal('gpa', { precision: 3, scale: 2 }),
  methodOfStudy: varchar('method_of_study', { length: 50 }), // e.g., 'online', 'in-person'
  graduationYear: integer('graduation_year'),
  university: varchar('university', { length: 100 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

export const leads = pgTable('leads', {
   id: serial('id').primaryKey(),
   name: varchar('name', { length: 100 }).notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),

});

export const fees = pgTable('fees', {
   id: serial('id').primaryKey(),
  fee: integer('fee').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),

});

export const grades = pgTable('grades', {
   id: serial('id').primaryKey(),
  grade: varchar('grade').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),

});



export type Users = typeof user.$inferSelect;
export type Sessions = typeof session.$inferSelect;
export type Roles = typeof roles.$inferSelect;
export type Permissions = typeof permissions.$inferSelect;
export type RolePermissions = typeof rolePermissions.$inferSelect;
export type SpecialPermissions = typeof specialPermissions.$inferSelect;
export type Persons = typeof persons.$inferSelect;
export type Students = typeof students.$inferSelect;
export type Tutors = typeof tutors.$inferSelect;
export type Parents = typeof parents.$inferSelect;
export type Employees = typeof employees.$inferSelect;
export type StudentParentRelations = typeof studentParentRelations.$inferSelect;
export type Subjects = typeof subjects.$inferSelect;
export type SubjectStudents = typeof subjectStudents.$inferSelect;
export type SubjectTutors = typeof subjectTutors.$inferSelect;
export type Locations = typeof locations.$inferSelect;
export type TutoringSessions = typeof tutoringSessions.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;
export type TutorStudentMatches = typeof tutorStudentMatches.$inferSelect;
export type StudentStudyPlans = typeof studentStudyPlans.$inferSelect;
export type Assessments = typeof assessments.$inferSelect;
export type AssessmentResults = typeof assessmentResults.$inferSelect;
export type PaymentMethods = typeof paymentMethods.$inferSelect;
export type PersonPaymentMethods = typeof personPaymentMethods.$inferSelect;
export type Payments = typeof payments.$inferSelect;
export type PaymentSessions = typeof paymentSessions.$inferSelect;
export type Invoices = typeof invoices.$inferSelect;
export type TutorPayments = typeof tutorPayments.$inferSelect;
export type EmployeePayments = typeof employeePayments.$inferSelect;
export type Schedules = typeof schedules.$inferSelect;
export type Cancellations = typeof cancellations.$inferSelect;
export type Contacts = typeof contacts.$inferSelect;
export type Comments = typeof comments.$inferSelect;
export type AuditLogs = typeof auditLogs.$inferSelect;
export type Documents = typeof documents.$inferSelect;
export type RevenueSummaries = typeof revenue_summaries.$inferSelect;
export type StudentProgress = typeof student_progress;
export type TutorRatings = typeof tutor_ratings;
export type Fees = typeof fees;
export type Leads = typeof leads;