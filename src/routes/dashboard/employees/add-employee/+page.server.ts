import { asc, eq } from 'drizzle-orm';
import {  error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from '$lib/server/db';
import { employees, persons } from '$lib/server/db/schema'
import { form } from '$app/server';

export const load: PageServerLoad = async ({ parent }) => {
  const layoutData = await parent();
  const permList = layoutData.permList;
  const perm = 'can_create_employees';

  const hasPerm = permList.some(p => p.name === perm);

     if (!hasPerm) {
     error(403, 'Not Allowed! You do not have permission to create new employees. <br /> Talk to an admin to change it.');
  }
}
export const actions = {
  createEmployee: async ({request}) => {
    const formData = await request.formData();

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
    


    if (
        !firstName ||
        !lastName ||
        !grandFatherName ||
        !email ||
        !gender ||
        !address ||
        !phone ||
        !dateOfBirth ||
        !position ||
        !hireDate
    ) {
        return { status: 400, body: { error: 'All fields are required.' } };
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

    if (error) {
      return { status: 500, body: { error: 'Failed to create employee' } };
    }

    return { status: 201, body: { success: true } };
  }
};