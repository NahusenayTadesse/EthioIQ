import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { persons, parents, studentParentRelations} from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { type Infer, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { parentSchema } from '$lib/server/zodschema';
import { fail } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';

type Message = { status: 'error' | 'success' | 'warning'; text: string };

export const load: PageServerLoad = async ({ params, parent }) => {
	const layoutData = await parent();
	const permList: Array<{ name: string }> = layoutData.permList;
	const perm = 'can_create_parents';

	const hasPerm = permList.some((p) => p.name === perm);

	if (!hasPerm) {
		error(
			403,
			'Not Allowed! You do not have permission to see employees. <br /> Talk to an admin to change it.'
		);
	}

	const { id } = params;

	const form = await superValidate(zod4(parentSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
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
		const type = (formData.get('type') as string) || '';
		const notes = (formData.get('notes') as string) || '';
		const id = (formData.get('id') as string) || '';
        

		try {
			const [parent] = await db.insert(persons).values({
				firstName,
				lastName,
				gender,
				phone,
                type: "parent"
			}).returning({id: persons.id});

            const [parentDetail] = await db.insert(parents).values({
                personId: parent.id,
                specificLocation,
                notes,
            }).returning({id: parents.id});

             await db.insert(studentParentRelations).values({
                 parentId: parentDetail.id,
                 studentId: id,
                 isPrimary,
                 relationshipType: type
             });

			setFlash({ type: 'success', message: 'Parent Added Successfully' }, cookies);
		} catch (err) {
			setFlash({ type: 'error', message: 'Failed to add parent' + err }, cookies);
			return fail(500, { form });
		}
	}
};
