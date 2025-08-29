import {  fail, error } from "@sveltejs/kit";
import { message } from 'sveltekit-superforms';

import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { employees, persons } from '$lib/server/db/schema'
import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { schema } from "$lib/server/zodschema";

export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_create_employees';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to create new employees. <br /> Talk to an admin to change it.');
  }
  const form = await superValidate(zod4(schema));

  // Always return { form } in load functions
  return { form };
}
export const actions = {
  createEmployee: async ({request}) => {
    const formData = await request.formData();
    const form = await superValidate(formData, zod4(schema));

    if (!form.valid) return fail(400, { form });



    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const grandFatherName = formData.get('grandFatherName') as string;
    const email = formData.get('email') as string;
    const gender = formData.get('gender') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const position = formData.get('position') as string;
    const salary = formData.get('salary') as string;
    const hireDate = formData.get('hireDate') as string;
    const notes = formData.get('notes') as string;
    const type = 'employee';
    


     if (!form.valid) {
      // Return { form } and things will just work.
      return fail(400, { form });
    }

    

    const [employee] = await db.insert(persons).values({
      firstName,
      lastName,
      grandFatherName,
      email,
      gender,
      address,
      phone,
      type,
      dateOfBirth
    }).returning();

     await db.insert(employees).values({ personId: employee.id, position, salary: Number(salary), hireDate, notes });

    return message(form, 'Form posted successfully!');
  }

  
};