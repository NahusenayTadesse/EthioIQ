import type { Actions, PageServerLoad } from './$types'
import { eq, sql, and, isNull } from 'drizzle-orm'
import { db } from '$lib/server/db';
import {
	persons,
	parents,
	subjects,
	subjectStudents,
	studentParentRelations,
	tutors,
	tutorStudentMatches
} from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { addSubjectSchema, connectTutorSchema, connectTutorSchema, existingParentSchema, parentSchema } from '$lib/server/zodschema';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

type Message = { status: 'error' | 'success' | 'warning'; text: string };

export const load: PageServerLoad = async ({ params, parent }) => {
	const layoutData = await parent();
	const permList: Array<{ name: string }> = layoutData.permList;
	const perm = 'can_edit_students';

	const hasPerm = permList.some((p) => p.name === perm);

	if (!hasPerm) {
		error(
			403,
			'Not Allowed! You do not have permission to see employees. <br /> Talk to an admin to change it.'
		);
	}

	const { id } = params;

	const form = await superValidate(zod4(parentSchema));
	const subjectForm = await superValidate(zod4(addSubjectSchema));
	const existingParentForm = await superValidate(zod4(existingParentSchema));
	const connectTutorForm = await superValidate(zod4(connectTutorSchema));

	const allSubjects = await db
		.select({
			value: subjects.id,
			name: subjects.name
		})
		.from(subjects)
		.leftJoin(
			subjectStudents,
			and(
				eq(subjectStudents.subjectId, subjects.id),
				eq(subjectStudents.studentId, id)
			)
		)
		.where(isNull(subjectStudents.studentId));



	const parentsNames = await db
  .select({
    value: parents.id,
    name: sql<string>`concat(${persons.firstName}, ' ', ${persons.lastName})`,
  })
  .from(parents)
  .leftJoin(persons, eq(parents.personId, persons.id))
  .leftJoin(
    studentParentRelations,
    and(
      eq(studentParentRelations.parentId, parents.id),
      eq(studentParentRelations.studentId, id)
    )
  )
  .where(isNull(studentParentRelations.parentId));



	  
const possibleTutors = await db
  .select({
    value: tutors.id,
    name: sql<string>`concat(${persons.firstName}, ' ', ${persons.lastName})`,
  })
  .from(tutors)
  .leftJoin(persons, eq(tutors.personId, persons.id))
  .leftJoin(
    tutorStudentMatches,
    and(
      eq(tutorStudentMatches.tutorId, tutors.id),
      eq(tutorStudentMatches.studentId, id),
    )
  )
  .where(isNull(tutorStudentMatches.tutorId));

	return {
		form,
		subjectForm,
		allSubjects,
		parentsNames,
		existingParentForm,
		possibleTutors,
		connectTutorForm
	};
};
export const actions: Actions = {
	addParent: async ({ request, cookies }) => {
		const formData = await request.formData();
		const form = await superValidate<Infer<typeof parentSchema>, Message>(
			formData,
			zod4(parentSchema)
		);
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Please check the form for Errors' }, cookies);

			return fail(400, { form });
		}

		const firstName = (formData.get('firstName') as string) || '';
		const lastName = (formData.get('lastName') as string) || '';
		const gender = (formData.get('gender') as string) || '';
		const phone = (formData.get('phone') as string) || '';
		const specificLocation = (formData.get('specificLocation') as string) || '';
		const isPrimary = (formData.get('isPrimary') as string) || '';
		const livingTogether = (formData.get('livingTogether') as string) || '';
		const type = (formData.get('type') as string) || '';
		const notes = (formData.get('notes') as string) || '';
		const addedNotes = (formData.get('addedNotes') as string) || '';
		const id = (formData.get('id') as string) || '';

		try {
			const [parent] = await db
				.insert(persons)
				.values({
					firstName,
					lastName,
					gender,
					phone,
					type: 'parent'
				})
				.returning({ id: persons.id });

			const [parentDetail] = await db
				.insert(parents)
				.values({
					personId: parent.id,
					specificLocation,
					notes
				})
				.returning({ id: parents.id });

			await db.insert(studentParentRelations).values({
				parentId: parentDetail.id,
				studentId: id,
				isPrimary,
				relationshipType: type,
				livingTogether,
				notes: addedNotes
			});

			setFlash({ type: 'success', message: 'Parent Added Successfully' }, cookies);
		} catch (err) {
			setFlash({ type: 'error', message: 'Failed to add parent' + err }, cookies);
			return fail(500, { form });
		}
	},

	addSubject: async ({ request, cookies }) => {
		const formData = await request.formData();
		const form = await superValidate<Infer<typeof addSubjectSchema>, Message>(
			formData,
			zod4(addSubjectSchema)
		);

		if (!form.valid) {
			setFlash({ type: 'error', message: 'Please check the form for Errors' }, cookies);

			return fail(400, { form });
		}

		const subject = (formData.get('subject') as string) || '';
		const profieciencyLevel = (formData.get('profieciencyLevel') as string) || '';
		const startedAtRaw = formData.get('startedAt');
		const startedAt = startedAtRaw ? new Date(startedAtRaw.toString()) : null;
		const notes = (formData.get('notes') as string) || '';
		const id = (formData.get('id') as string) || '';

		try {
		
			await db.insert(subjectStudents).values({
				studentId: id,
				subjectId: subject,
				proficiencyLevel: profieciencyLevel,
				startedAt,
				notes
			});

			setFlash({ type: 'success', message: 'Subject Added Successfully' }, cookies);
		} catch (err) {
			setFlash({ type: 'error', message: 'Subject to add parent' + err }, cookies);
			return fail(500, { form });
		}
	},
	addExistingParent: async ({ request, cookies }) => {
		const formData = await request.formData();
		const form = await superValidate<Infer<typeof existingParentSchema>, Message>(
			formData,
			zod4(existingParentSchema)
		);
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Please check the form for Errors' }, cookies);

			return fail(400, { form });
		}

		const parentId = (formData.get('parent') as string) || '';
		const isPrimary = (formData.get('isPrimary') as string) || '';
		const livingTogether = (formData.get('livingTogether') as string) || '';
		const type = (formData.get('type') as string) || '';
		const notes = (formData.get('notes') as string) || '';
		const id = (formData.get('id') as string) || '';

		try {
			

			await db.insert(studentParentRelations).values({
				parentId,
				studentId: id,
				isPrimary,
				relationshipType: type,
				livingTogether,
				notes
			});

			setFlash({ type: 'success', message: 'Parent Added Successfully' }, cookies);
		} catch (err) {
			setFlash({ type: 'error', message: 'Failed to add parent' + err }, cookies);
			return fail(500, { form });
		}
	},
	addTutor: async ({ request, cookies }) => {
		const formData = await request.formData();
		const form = await superValidate<Infer<typeof connectTutorSchema>, Message>(
			formData,
			zod4(connectTutorSchema)
		);
		if (!form.valid) {
			setFlash({ type: 'error', message: 'Please check the form for Errors' }, cookies);

			return fail(400, { form });
		}

		const tutorId = (formData.get('tutor') as string) || '';
		const subjectId = (formData.get('subject') as string) || '';
		const notes = (formData.get('notes') as string) || '';
		const id = (formData.get('id') as string) || '';

		try {
			

			await db.insert(tutorStudentMatches).values({
				tutorId,
				studentId: id,
				subjectId,
				notes
			});

			setFlash({ type: 'success', message: 'Tutor Added Successfully' }, cookies);
		} catch (err) {
			setFlash({ type: 'error', message: 'Failed to add tutor' + err }, cookies);
			return fail(500, { form });
		}
	}
};
